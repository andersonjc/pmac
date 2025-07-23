# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This repository follows **Project Management as Code (PMaC)** methodology for AI-assisted development.

**Required Reading Before Any Work:**

- `project-management-as-code.md` - Complete PMaC methodology
- `project-requirements.md` - Technical requirements and architecture
- `project-backlog.yml` - Current task priorities and status

## Project Management as Code (PMaC) Requirements

**CRITICAL: All development follows PMaC methodology documented in `project-management-as-code.md`**

Refer to the complete PMaC methodology in `project-management-as-code.md` for:

- Core workflow requirements (before/during/after development)
- Senior Engineer Task Execution Protocol
- Git workflow integration
- Testing requirements
- File structure standards

**Additional Guidelines:**

- Always use the PMaC CLI instead of modifying project-backlog.yml directly. Install globally with `npm install -g pmac-cli` and use `pmac` commands as documented in the [PMaC CLI repository](https://github.com/andersonjc/pmac-cli).

### Before Starting Work
- Read current task from `project-backlog.yml` (status: "ready", highest priority)
- Update task status to "in_progress" when beginning
- Follow exact requirements and acceptance criteria as specified

### During Development  
- Update task notes with implementation decisions in `project-backlog.yml`
- Log all prompts and decisions in `prompts-log.md`
- Follow technical requirements exactly - no improvisation

### Before Committing
- Validate ALL acceptance criteria are met
- Update task status ("testing" → "completed" when validated)  
- Commit PMaC files with every code change
- Include task ID in commit messages: "TASK-ID: Description"

## Development Commands

**PMaC Management (requires [PMaC CLI](https://github.com/andersonjc/pmac-cli)):**
```bash
pmac list                     # View current tasks
pmac update TASK-001 in_progress "Starting work"
pmac validate                 # Check dependencies
pmac viewer                   # Launch interactive viewer
```

📚 **Full CLI Documentation**: See [PMaC CLI repository](https://github.com/andersonjc/pmac-cli) for complete command reference.

**Testing & Quality:**
```bash
pnpm test                       # Run all tests
pnpm lint                   # Run linting  
pnpm build                  # Build project
```

## Quality Standards

### CRITICAL: Testing Enforcement Policy

**ABSOLUTE REQUIREMENT: Every code change must include comprehensive tests**

1. **Model Changes**: Must include unit tests for:
   - All public methods and business logic
   - Model relationships and cascading behavior
   - Validation rules and constraints
   - Factory functionality

2. **API Changes**: Must include integration tests for:
   - All endpoints with success/failure scenarios
   - Authentication and authorization flows
   - Multi-tenant data isolation
   - Error handling and edge cases

3. **Business Logic**: Must include tests for:
   - Permission checks and access control
   - Data transformation and calculations
   - State transitions and workflows
   - Cross-model interactions

**VIOLATION CONSEQUENCES:**
- Any task marked "completed" without implementing tests is a CRITICAL FAILURE
- Must immediately reopen task, document failure in PMaC, and implement tests
- Code without tests cannot be merged to master branch

### Additional Standards

- **Test Coverage**: Aim for 100% on new code
- **Code Quality**: Follow existing patterns and conventions
- **Security**: Validate inputs, secure auth patterns, audit logs
- **Documentation**: Update relevant docs with changes

## Implementation Philosophy

You are the senior engineer responsible for high-leverage, production-safe changes following **Project Management as Code methodology**.

**Core Principles:**

- Follow PMaC methodology exactly as documented in `project-management-as-code.md`
- Do not improvise or deviate from specified requirements
- Do not over-engineer solutions
- Maintain focus on acceptance criteria validation
- Always update PMaC files with code changes
- Always use the PMaC CLI tool to interact with the project backlog (install: `npm install -g pmac-cli`)

**CRITICAL: PMaC File Separation Protocol**
- **prompts-log.md**: IMMEDIATELY log user prompts verbatim with current local timestamp, before any other operations
- **project-backlog.yml**: Use PMaC CLI for implementation notes, milestones, decisions (see [PMaC CLI docs](https://github.com/andersonjc/pmac-cli))
- **NO mixing**: Prompts go to prompts-log, dev context goes to backlog notes
- **Timestamp Format**: Use ISO format or follow PMaC CLI conventions (see [PMaC CLI docs](https://github.com/andersonjc/pmac-cli) for specifics)

## Senior Engineer Task Execution Rule

Applies to: All Tasks

Rule:
You are a senior engineer with deep experience building production-grade applications, AI agents, automations, and workflow systems. Every task you execute must follow this procedure without exception:

1. **Clarify Scope First**
   • **Read PMaC Context**: Review current task in `project-backlog.yml` and technical requirements in `project-requirements.md`
   • **Create ADRs if needed**: For architectural decisions, create ADRs using the standard template
   • Map out exactly how you will approach the task according to specified requirements
   • Confirm your interpretation matches the acceptance criteria exactly
   • Write a clear plan showing what functions, modules, or components will be touched and why
   • Do not begin implementation until this is done and reasoned through

2. **Locate Exact Code Insertion Point**
   • Identify the precise file(s) and line(s) where the change will live
   • Follow architecture patterns specified in `project-requirements.md`
   • Never make sweeping edits across unrelated files
   • If multiple files are needed, justify each inclusion explicitly against task requirements
   • Do not create new abstractions or refactor unless the task explicitly says so

3. **Minimal, Contained Changes**
   • Only write code directly required to satisfy the task acceptance criteria
   • Follow established patterns specified in technical requirements
   • **CRITICAL: ALWAYS implement comprehensive tests as part of ANY code changes**
   • No speculative changes or "while we're here" edits
   • All logic should be isolated to not break existing flows
   • All work should be performed in feature branches that can be reviewed in PRs

4. **Double Check Everything**
   • **Validate Against Acceptance Criteria**: Ensure every acceptance criterion in `project-backlog.yml` is met
   • Review for correctness, scope adherence, and side effects
   • Ensure your code follows architecture specified in `project-requirements.md`
   • Ensure code aligns with existing codebase patterns and avoids regressions
   • Explicitly verify whether anything downstream will be impacted
   • Run check, lint, test, build, and any other appropriate commands to ensure everything is green

5. **Deliver Clearly with PMaC Updates**
   • **Update Task Status**: Move task to "testing" or "completed" based on validation via PMaC CLI
   • **Document Implementation**: Add detailed notes to task about implementation decisions via PMaC CLI (see [command reference](https://github.com/andersonjc/pmac-cli))
   • **SEPARATE FILE USAGE**: Use prompts-log.md for user prompts only, project-backlog.yml for all dev context
   • Summarize what was changed and why in relation to task requirements
   • List every file modified and what was done in each
   • If there are any assumptions or risks, flag them for review
   • **MANDATORY: Always implement comprehensive tests for ALL new code**
   • **NEVER mark a task as completed without implementing tests**
   • Test coverage must include: unit tests, integration tests, business logic validation
   • **FAILURE TO IMPLEMENT TESTS IS A CRITICAL VIOLATION OF PMAC METHODOLOGY**
   • Always update all documentation related to changes made
   • **Include PMaC Context**: Reference task ID and acceptance criteria in commit messages
   • Always include Claude Code citations and/or co-authorship in commit messages where you contributed

## PMaC File References

This repository uses these interconnected PMaC files:
- `project-management-as-code.md` - Complete methodology
- `project-backlog.yml` - Task management and tracking
- `prompts-log.md` - Decision log and conversation history  
- `project-requirements.md` - Technical architecture and specs
