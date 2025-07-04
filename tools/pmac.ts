#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

interface Task {
  id: string;
  title: string;
  status: "ready" | "in_progress" | "testing" | "completed";
  priority: "critical" | "high" | "medium" | "low";
  estimated_hours: number;
  actual_hours?: number;
  assignee?: string;
  requirements: string[];
  acceptance_criteria?: string[];
  dependencies: string[];
  blocks: string[];
  notes: string[];
}

interface Phase {
  title: string;
  description: string;
  status: string;
  estimated_duration: string;
  tasks: Task[];
}

interface ProjectBacklog {
  metadata: Record<string, any>;
  phases: Record<string, Phase>;
  epic_summary?: Record<string, any>;
  risks?: Record<string, any>;
}

class PMaCCLI {
  private backlogPath: string;
  private backlog!: ProjectBacklog;

  constructor() {
    this.backlogPath = resolve(process.cwd(), "project-backlog.yml");
    this.loadBacklog();
  }

  private loadBacklog(): void {
    try {
      const content = readFileSync(this.backlogPath, "utf8");
      this.backlog = parseYaml(content) as ProjectBacklog;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.error(`
❌ PMaC Project Not Initialized

The file 'project-backlog.yml' was not found in the current directory.

To get started:
1. Copy the template: cp templates/project-backlog.yml project-backlog.yml
2. Edit the project metadata and tasks for your specific project
3. Run PMaC commands to manage your project backlog

For more information, see: project-management-as-code.md
`);
      } else if (error.name === 'YAMLParseError') {
        console.error(`
❌ Invalid YAML Format

The file 'project-backlog.yml' contains invalid YAML syntax:
${error.message}

Please check the file format and fix any syntax errors.
`);
      } else {
        console.error(`
❌ Error Loading Project Backlog

Failed to load 'project-backlog.yml':
${error.message}

Please check the file permissions and format.
`);
      }
      process.exit(1);
    }
  }

  private saveBacklog(): void {
    try {
      const yamlContent = stringifyYaml(this.backlog, {
        indent: 2,
        lineWidth: 120,
        minContentWidth: 20,
        nullStr: "null",
      });
      writeFileSync(this.backlogPath, yamlContent);
    } catch (error) {
      console.error("Error saving project-backlog.yml:", error);
      process.exit(1);
    }
  }

  private findTask(
    taskId: string,
  ): { phase: string; taskIndex: number; task: Task } | null {
    for (const [phaseName, phase] of Object.entries(this.backlog.phases)) {
      const taskIndex = phase.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        return {
          phase: phaseName,
          taskIndex,
          task: phase.tasks[taskIndex],
        };
      }
    }
    return null;
  }

  updateTaskStatus(
    taskId: string,
    status: Task["status"],
    note?: string,
  ): void {
    const taskInfo = this.findTask(taskId);
    if (!taskInfo) {
      console.log(`Task ${taskId} not found`);
      return;
    }

    const { phase, taskIndex, task } = taskInfo;
    this.backlog.phases[phase].tasks[taskIndex].status = status;

    if (note) {
      // Generate timestamp with date, time, and local timezone (consistent with addTaskNote)
      const now = new Date();
      const timestamp = now.toLocaleString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }).replace(',', '');
      
      if (!this.backlog.phases[phase].tasks[taskIndex].notes) {
        this.backlog.phases[phase].tasks[taskIndex].notes = [];
      }
      this.backlog.phases[phase].tasks[taskIndex].notes.push(
        `${timestamp}: ${note}`,
      );
    }

    this.saveBacklog();
    console.log(`Updated ${taskId} status to ${status}`);
    if (note) {
      console.log(`Added note: ${note}`);
    }
  }

  addTaskNote(taskId: string, note: string): void {
    const taskInfo = this.findTask(taskId);
    if (!taskInfo) {
      console.log(`Task ${taskId} not found`);
      return;
    }

    const { phase, taskIndex } = taskInfo;
    
    // Generate timestamp with date, time, and local timezone
    const now = new Date();
    const timestamp = now.toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).replace(',', '');
    
    if (!this.backlog.phases[phase].tasks[taskIndex].notes) {
      this.backlog.phases[phase].tasks[taskIndex].notes = [];
    }
    
    // Always prepend timestamp - CLI automatically adds timestamps to all notes
    const formattedNote = `${timestamp}: ${note}`;
    
    this.backlog.phases[phase].tasks[taskIndex].notes.push(formattedNote);

    this.saveBacklog();
    console.log(`Added note to ${taskId}: ${note}`);
  }

  listTasks(
    statusFilter?: Task["status"],
    priorityFilter?: Task["priority"],
  ): void {
    console.log("Project Tasks:");
    console.log("==============");

    for (const [phaseName, phase] of Object.entries(this.backlog.phases)) {
      let hasVisibleTasks = false;

      const filteredTasks = phase.tasks.filter((task) => {
        const statusMatch = !statusFilter || task.status === statusFilter;
        const priorityMatch =
          !priorityFilter || task.priority === priorityFilter;
        return statusMatch && priorityMatch;
      });

      if (filteredTasks.length > 0) {
        console.log(`\n📋 ${phase.title} (${phaseName})`);
        filteredTasks.forEach((task) => {
          const statusIcon = this.getStatusIcon(task.status);
          const priorityIcon = this.getPriorityIcon(task.priority);
          console.log(
            `  ${statusIcon} ${task.id}: ${task.title} ${priorityIcon}`,
          );
          if (task.dependencies && task.dependencies.length > 0) {
            console.log(`    Dependencies: ${task.dependencies.join(", ")}`);
          }
          if (task.blocks && task.blocks.length > 0) {
            console.log(`    Blocks: ${task.blocks.join(", ")}`);
          }
        });
        hasVisibleTasks = true;
      }
    }
  }

  validateDependencies(): void {
    console.log("Dependency Validation:");
    console.log("=====================");

    const allTaskIds = new Set<string>();
    const issues: string[] = [];

    // Collect all task IDs
    for (const phase of Object.values(this.backlog.phases)) {
      for (const task of phase.tasks) {
        allTaskIds.add(task.id);
      }
    }

    // Validate dependencies and blocks
    for (const [phaseName, phase] of Object.entries(this.backlog.phases)) {
      for (const task of phase.tasks) {
        // Check dependencies exist
        if (task.dependencies) {
          for (const depId of task.dependencies) {
            if (!allTaskIds.has(depId)) {
              issues.push(
                `❌ ${task.id}: Dependency '${depId}' does not exist`,
              );
            }
          }
        }

        // Check blocks exist
        if (task.blocks) {
          for (const blockId of task.blocks) {
            if (!allTaskIds.has(blockId)) {
              issues.push(
                `❌ ${task.id}: Blocks '${blockId}' which does not exist`,
              );
            }
          }
        }

        // Check for circular dependencies
        if (this.hasCircularDependency(task.id, [])) {
          issues.push(`❌ ${task.id}: Circular dependency detected`);
        }
      }
    }

    if (issues.length === 0) {
      console.log("✅ All dependencies are valid");
    } else {
      console.log("Issues found:");
      issues.forEach((issue) => console.log(issue));
    }
  }

  private hasCircularDependency(taskId: string, visited: string[]): boolean {
    if (visited.includes(taskId)) {
      return true;
    }

    const taskInfo = this.findTask(taskId);
    if (!taskInfo) return false;

    const newVisited = [...visited, taskId];

    if (taskInfo.task.dependencies) {
      for (const depId of taskInfo.task.dependencies) {
        if (this.hasCircularDependency(depId, newVisited)) {
          return true;
        }
      }
    }

    return false;
  }

  showCriticalPath(): void {
    console.log("Critical Path Analysis:");
    console.log("======================");

    const taskMap = new Map<string, Task>();
    for (const phase of Object.values(this.backlog.phases)) {
      for (const task of phase.tasks) {
        taskMap.set(task.id, task);
      }
    }

    // Find tasks with no dependencies (entry points)
    const entryTasks = Array.from(taskMap.values()).filter(
      (task) => !task.dependencies || task.dependencies.length === 0,
    );

    console.log("\n🚀 Entry Points (no dependencies):");
    entryTasks.forEach((task) => {
      console.log(
        `  ${this.getStatusIcon(task.status)} ${task.id}: ${task.title} (${task.estimated_hours}h)`,
      );
    });

    // Find longest path
    let longestPath: { tasks: string[]; totalHours: number } = {
      tasks: [],
      totalHours: 0,
    };

    for (const entryTask of entryTasks) {
      const path = this.findLongestPath(entryTask.id, taskMap);
      if (path.totalHours > longestPath.totalHours) {
        longestPath = path;
      }
    }

    console.log("\n⚡ Critical Path:");
    longestPath.tasks.forEach((taskId) => {
      const task = taskMap.get(taskId)!;
      console.log(
        `  ${this.getStatusIcon(task.status)} ${task.id}: ${task.title} (${task.estimated_hours}h)`,
      );
    });
    console.log(`\n📊 Total Critical Path: ${longestPath.totalHours} hours`);
  }

  private findLongestPath(
    taskId: string,
    taskMap: Map<string, Task>,
  ): { tasks: string[]; totalHours: number } {
    const task = taskMap.get(taskId);
    if (!task) return { tasks: [], totalHours: 0 };

    const blockedTasks = Array.from(taskMap.values()).filter(
      (t) => t.dependencies && t.dependencies.includes(taskId),
    );

    if (blockedTasks.length === 0) {
      return { tasks: [taskId], totalHours: task.estimated_hours };
    }

    let longestSubPath: { tasks: string[]; totalHours: number } = { tasks: [], totalHours: 0 };
    for (const blockedTask of blockedTasks) {
      const subPath = this.findLongestPath(blockedTask.id, taskMap);
      if (subPath.totalHours > longestSubPath.totalHours) {
        longestSubPath = subPath;
      }
    }

    return {
      tasks: [taskId, ...longestSubPath.tasks],
      totalHours: task.estimated_hours + longestSubPath.totalHours,
    };
  }

  bulkUpdatePhase(phaseName: string, status: Task["status"]): void {
    if (!this.backlog.phases[phaseName]) {
      console.log(`Phase '${phaseName}' not found`);
      return;
    }

    const phase = this.backlog.phases[phaseName];
    const timestamp = new Date().toISOString().split("T")[0];

    phase.tasks.forEach((task) => {
      task.status = status;
      if (!task.notes) {
        task.notes = [];
      }
      task.notes.push(`${timestamp}: Bulk status update to ${status}`);
    });

    this.saveBacklog();
    console.log(
      `Updated all tasks in phase '${phaseName}' to status '${status}'`,
    );
  }

  createTask(
    taskId: string,
    title: string,
    phaseName: string,
    priority: Task["priority"] = "medium",
    estimatedHours: number = 8,
  ): void {
    if (!this.backlog.phases[phaseName]) {
      console.log(`Phase '${phaseName}' not found`);
      console.log(
        "Available phases:",
        Object.keys(this.backlog.phases).join(", "),
      );
      return;
    }

    // Check if task ID already exists
    const existingTask = this.findTask(taskId);
    if (existingTask) {
      console.log(`Task ${taskId} already exists`);
      return;
    }

    const newTask: Task = {
      id: taskId,
      title: title,
      status: "ready",
      priority: priority,
      estimated_hours: estimatedHours,
      requirements: [],
      dependencies: [],
      blocks: [],
      notes: [],
    };

    const timestamp = new Date().toISOString().split("T")[0];
    newTask.notes.push(`${timestamp}: Task created via PMaC CLI`);

    this.backlog.phases[phaseName].tasks.push(newTask);
    this.saveBacklog();

    console.log(`✅ Created task ${taskId}: ${title} in phase ${phaseName}`);
    console.log(`   Priority: ${priority}, Estimated hours: ${estimatedHours}`);
  }

  updateTaskAttribute(taskId: string, attribute: keyof Task, value: any): void {
    const taskInfo = this.findTask(taskId);
    if (!taskInfo) {
      console.log(`Task ${taskId} not found`);
      return;
    }

    const { phase, taskIndex } = taskInfo;
    const task = this.backlog.phases[phase].tasks[taskIndex];
    const timestamp = new Date().toISOString().split("T")[0];

    // Handle different attribute types
    switch (attribute) {
      case "priority":
        if (!["critical", "high", "medium", "low"].includes(value)) {
          console.log("Priority must be: critical, high, medium, or low");
          return;
        }
        const oldPriority = task.priority;
        task.priority = value;
        if (!task.notes) task.notes = [];
        task.notes.push(
          `${timestamp}: Priority changed from ${oldPriority} to ${value}`,
        );
        break;

      case "estimated_hours":
        const hours = parseInt(value);
        if (isNaN(hours) || hours <= 0) {
          console.log("Estimated hours must be a positive number");
          return;
        }
        const oldHours = task.estimated_hours;
        task.estimated_hours = hours;
        if (!task.notes) task.notes = [];
        task.notes.push(
          `${timestamp}: Estimated hours changed from ${oldHours} to ${hours}`,
        );
        break;

      case "title":
        const oldTitle = task.title;
        task.title = value;
        if (!task.notes) task.notes = [];
        task.notes.push(
          `${timestamp}: Title changed from "${oldTitle}" to "${value}"`,
        );
        break;

      case "assignee":
        const oldAssignee = task.assignee || "unassigned";
        task.assignee = value;
        if (!task.notes) task.notes = [];
        task.notes.push(
          `${timestamp}: Assignee changed from ${oldAssignee} to ${value}`,
        );
        break;

      case "dependencies":
        task.dependencies = this.parseArrayInput(value);
        if (!task.notes) task.notes = [];
        task.notes.push(
          `${timestamp}: Dependencies updated to: ${task.dependencies.join(", ") || "none"}`,
        );
        break;

      case "blocks":
        task.blocks = this.parseArrayInput(value);
        if (!task.notes) task.notes = [];
        task.notes.push(
          `${timestamp}: Blocks updated to: ${task.blocks.join(", ") || "none"}`,
        );
        break;

      case "requirements":
        task.requirements = this.parseArrayInput(value);
        if (!task.notes) task.notes = [];
        task.notes.push(
          `${timestamp}: Requirements updated (${task.requirements.length} items)`,
        );
        break;

      default:
        console.error(
          `Attribute '${String(attribute)}' is not supported for updates`,
        );
        return;
    }

    this.saveBacklog();
    
    // Get the final formatted value from the task
    let displayValue: string;
    switch (attribute) {
      case "dependencies":
      case "blocks":
      case "requirements":
        displayValue = this.formatValue(task[attribute] || []);
        break;
      default:
        displayValue = this.formatValue(value);
    }
    
    console.log(
      `✅ Updated ${taskId} ${String(attribute)} to: ${displayValue}`,
    );
  }

  private parseArrayInput(input: string): string[] {
    if (!input || input.trim() === "") return [];
    return input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  private formatValue(value: any): string {
    if (Array.isArray(value)) {
      return value.join(", ") || "none";
    }
    return String(value);
  }

  addDependency(taskId: string, dependencyId: string): void {
    const taskInfo = this.findTask(taskId);
    const depInfo = this.findTask(dependencyId);

    if (!taskInfo) {
      console.log(`Task ${taskId} not found`);
      return;
    }
    if (!depInfo) {
      console.log(`Dependency task ${dependencyId} not found`);
      return;
    }

    const { phase, taskIndex } = taskInfo;
    const task = this.backlog.phases[phase].tasks[taskIndex];

    if (!task.dependencies) task.dependencies = [];

    if (task.dependencies.includes(dependencyId)) {
      console.error(`${taskId} already depends on ${dependencyId}`);
      return;
    }

    // Check for circular dependencies
    if (this.wouldCreateCircularDependency(taskId, dependencyId)) {
      console.log(
        `Adding dependency ${dependencyId} to ${taskId} would create a circular dependency`,
      );
      return;
    }

    task.dependencies.push(dependencyId);
    const timestamp = new Date().toISOString().split("T")[0];
    if (!task.notes) task.notes = [];
    task.notes.push(`${timestamp}: Added dependency on ${dependencyId}`);

    this.saveBacklog();
    console.log(
      `✅ Added dependency: ${taskId} now depends on ${dependencyId}`,
    );
  }

  removeDependency(taskId: string, dependencyId: string): void {
    const taskInfo = this.findTask(taskId);
    if (!taskInfo) {
      console.log(`Task ${taskId} not found`);
      return;
    }

    const { phase, taskIndex } = taskInfo;
    const task = this.backlog.phases[phase].tasks[taskIndex];

    if (!task.dependencies || !task.dependencies.includes(dependencyId)) {
      console.log(`${taskId} does not depend on ${dependencyId}`);
      return;
    }

    task.dependencies = task.dependencies.filter((dep) => dep !== dependencyId);
    const timestamp = new Date().toISOString().split("T")[0];
    if (!task.notes) task.notes = [];
    task.notes.push(`${timestamp}: Removed dependency on ${dependencyId}`);

    this.saveBacklog();
    console.log(
      `✅ Removed dependency: ${taskId} no longer depends on ${dependencyId}`,
    );
  }

  private wouldCreateCircularDependency(
    taskId: string,
    newDependencyId: string,
  ): boolean {
    // Check if newDependencyId (directly or indirectly) depends on taskId
    const visited = new Set<string>();
    const stack = [newDependencyId];

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      if (currentId === taskId) {
        return true; // Found circular dependency
      }

      const currentTask = this.findTask(currentId);
      if (currentTask && currentTask.task.dependencies) {
        stack.push(...currentTask.task.dependencies);
      }
    }

    return false;
  }

  moveTask(taskId: string, targetPhase: string, position?: number): void {
    const taskInfo = this.findTask(taskId);
    if (!taskInfo) {
      console.log(`Task ${taskId} not found`);
      return;
    }

    if (!this.backlog.phases[targetPhase]) {
      console.log(`Target phase '${targetPhase}' not found`);
      console.log(
        "Available phases:",
        Object.keys(this.backlog.phases).join(", "),
      );
      return;
    }

    const { phase: currentPhase, taskIndex, task } = taskInfo;

    if (currentPhase === targetPhase) {
      console.log(`Task ${taskId} is already in phase ${targetPhase}`);
      return;
    }

    // Remove from current phase
    this.backlog.phases[currentPhase].tasks.splice(taskIndex, 1);

    // Add to target phase
    const targetTasks = this.backlog.phases[targetPhase].tasks;
    if (
      position !== undefined &&
      position >= 0 &&
      position <= targetTasks.length
    ) {
      targetTasks.splice(position, 0, task);
    } else {
      targetTasks.push(task);
    }

    const timestamp = new Date().toISOString().split("T")[0];
    if (!task.notes) task.notes = [];
    task.notes.push(
      `${timestamp}: Moved from ${currentPhase} to ${targetPhase}`,
    );

    this.saveBacklog();
    console.log(
      `✅ Moved task ${taskId} from ${currentPhase} to ${targetPhase}`,
    );
  }

  listPhases(): void {
    console.log("Available Phases:");
    console.log("================");

    for (const [phaseName, phase] of Object.entries(this.backlog.phases)) {
      console.log(`📂 ${phaseName}: ${phase.title}`);
      console.log(`   ${phase.description}`);
      console.log(
        `   Status: ${phase.status}, Duration: ${phase.estimated_duration}`,
      );
      console.log(`   Tasks: ${phase.tasks.length}\n`);
    }
  }

  private getStatusIcon(status: Task["status"]): string {
    const icons = {
      ready: "⏳",
      in_progress: "🔄",
      testing: "🧪",
      completed: "✅",
    };
    return icons[status] || "❓";
  }

  private getPriorityIcon(priority: Task["priority"]): string {
    const icons = {
      critical: "🔥",
      high: "⚡",
      medium: "📋",
      low: "📝",
    };
    return icons[priority] || "❓";
  }

  showHelp(): void {
    console.log(`
PMaC CLI - Project Management as Code Tool

Usage: pnpm pmac <command> [options]

Task Management Commands:
  list [status] [priority]         List all tasks, optionally filtered by status and/or priority
  create <taskId> <title> <phase>  Create a new task in specified phase
  update <taskId> <status> [note]  Update task status (ready|in_progress|testing|completed)
  note <taskId> <note>             Add note to task
  move <taskId> <targetPhase>      Move task to different phase

Task Attribute Updates:
  set <taskId> <attribute> <value> Update task attributes:
    - priority: critical|high|medium|low
    - estimated_hours: number
    - title: "new title"
    - assignee: person
    - dependencies: "TASK-1,TASK-2" (comma-separated)
    - blocks: "TASK-3,TASK-4" (comma-separated)
    - requirements: "req1,req2" (comma-separated)

Dependency Management:
  add-dep <taskId> <dependencyId>  Add dependency relationship
  rm-dep <taskId> <dependencyId>   Remove dependency relationship

Analysis & Validation:
  validate                         Validate all dependencies
  critical-path                    Show critical path analysis
  phases                          List all phases and their details

Bulk Operations:
  bulk-phase <phase> <status>      Update all tasks in a phase to given status

Examples:
  pnpm pmac create TEST-001 "New feature implementation" core_data
  pnpm pmac set TEST-001 priority high
  pnpm pmac set TEST-001 estimated_hours 12
  pnpm pmac set TEST-001 dependencies "PMAC-001,INFRA-001"
  pnpm pmac add-dep API-002 API-001
  pnpm pmac move TEST-001 api_foundation
  pnpm pmac list in_progress high
  pnpm pmac update PMAC-002 testing "Implementation complete"
  pnpm pmac phases
`);
  }
}

// CLI Interface
const [, , command, ...args] = process.argv;
const cli = new PMaCCLI();

switch (command) {
  case "list":
    cli.listTasks(args[0] as Task["status"], args[1] as Task["priority"]);
    break;

  case "create":
    if (args.length < 3) {
      console.error(
        "Usage: pnpm pmac create <taskId> <title> <phase> [priority] [estimatedHours]",
      );
      process.exit(1);
    }
    const priority = (args[3] as Task["priority"]) || "medium";
    const estimatedHours = args[4] ? parseInt(args[4]) : 8;
    cli.createTask(args[0], args[1], args[2], priority, estimatedHours);
    break;

  case "update":
    if (args.length < 2) {
      console.error("Usage: pnpm pmac update <taskId> <status> [note]");
      process.exit(1);
    }
    cli.updateTaskStatus(args[0], args[1] as Task["status"], args[2]);
    break;

  case "note":
    if (args.length < 2) {
      console.error("Usage: pnpm pmac note <taskId> <note>");
      process.exit(1);
    }
    cli.addTaskNote(args[0], args.slice(1).join(" "));
    break;

  case "set":
    if (args.length < 3) {
      console.error("Usage: pnpm pmac set <taskId> <attribute> <value>");
      process.exit(1);
    }
    cli.updateTaskAttribute(
      args[0],
      args[1] as keyof Task,
      args.slice(2).join(" "),
    );
    break;

  case "move":
    if (args.length < 2) {
      console.error("Usage: pnpm pmac move <taskId> <targetPhase> [position]");
      process.exit(1);
    }
    const position = args[2] ? parseInt(args[2]) : undefined;
    cli.moveTask(args[0], args[1], position);
    break;

  case "add-dep":
    if (args.length < 2) {
      console.error("Usage: pnpm pmac add-dep <taskId> <dependencyId>");
      process.exit(1);
    }
    cli.addDependency(args[0], args[1]);
    break;

  case "rm-dep":
    if (args.length < 2) {
      console.error("Usage: pnpm pmac rm-dep <taskId> <dependencyId>");
      process.exit(1);
    }
    cli.removeDependency(args[0], args[1]);
    break;

  case "validate":
    cli.validateDependencies();
    break;

  case "critical-path":
    cli.showCriticalPath();
    break;

  case "phases":
    cli.listPhases();
    break;

  case "bulk-phase":
    if (args.length < 2) {
      console.error("Usage: pnpm pmac bulk-phase <phase> <status>");
      process.exit(1);
    }
    cli.bulkUpdatePhase(args[0], args[1] as Task["status"]);
    break;

  case "help":
  default:
    cli.showHelp();
    break;
}
