# Project Management as Code (PMaC)

A file-based methodology for AI-assisted software development.

## The Problem

Traditional PM tools (Jira, Linear, Asana) don't integrate with AI assistants. Context gets lost, decisions aren't tracked, and there's no standard way to maintain project continuity when working with AI.

## The Solution

Version-controlled files that provide complete project context to both humans and AI assistants.

## Core Files

| File                          | Purpose                                                   |
| ----------------------------- | --------------------------------------------------------- |
| **`project-backlog.yml`**     | Tasks, dependencies, status tracking, acceptance criteria |
| **`prompts-log.md`**          | User prompts only - verbatim conversation log             |
| **`project-requirements.md`** | Technical architecture and specifications                 |
| **`CLAUDE.md`**               | AI assistant instructions and project guidance            |

## Architecture Decision Records (ADRs)

PMaC includes standardized Architecture Decision Records (ADRs) for capturing significant architectural decisions throughout the project lifecycle.

### When to Create ADRs

Create ADRs when making decisions about:

- Technology stack choices (frameworks, databases, tools)
- Architectural patterns and approaches
- Integration strategies and API designs
- Security models and authentication approaches
- Deployment and infrastructure choices
- Data modeling and database decisions

### ADR Integration with PMaC

ADRs seamlessly integrate with the PMaC workflow:

- **Task-Driven Creation**: ADR creation documented in project backlog tasks
- **Decision Tracking**: ADRs referenced in task notes and implementation decisions
- **Complete Audit Trail**: ADR history maintained in Git alongside code changes
- **Architecture Alignment**: ADRs ensure decisions align with project requirements

### ADR Template and Process

1. **Use Standard Template**: Use the provided ADR template for consistency
2. **Sequential Numbering**: Number ADRs sequentially (ADR-001, ADR-002, etc.)
3. **Status Management**: Track status from PROPOSED → ACCEPTED → DEPRECATED/SUPERSEDED
4. **PMaC Integration**: Reference ADR creation in relevant backlog tasks

### ADR Directory Structure

**Recommended Organization:**

```
docs/
└── architecture/
    ├── README.md                    # ADR index and process documentation
    ├── ADR-001-technology-stack.md  # Individual ADRs
    ├── ADR-002-authentication.md
    └── ADR-003-database-choice.md
```

**File Naming Convention:**

- Format: `ADR-{number}-{kebab-case-title}.md`
- Examples: `ADR-001-project-structure.md`, `ADR-002-api-versioning.md`
- Numbers: Zero-padded to 3 digits (001, 002, etc.)

**ADR Index (README.md):**
Maintain an index in `docs/architecture/README.md` listing:

- All ADRs with status and brief description
- ADR process documentation
- Links to related architectural documentation

## Key Benefits

- **🤖 AI-Native**: YAML/Markdown format AI assistants can read and update
- **📝 Complete Audit Trail**: Every decision tracked in version control
- **⚡ Zero Context Loss**: Resume complex projects with full context
- **🔄 Git Integration**: PM data evolves alongside code
- **🏗️ Quality Assurance**: Built-in protocols ensure production-ready code

## Workflow

### Before Starting Work

1. Read next "ready" task from `project-backlog.yml` (highest priority)
2. Update task status to "in_progress"
3. Review requirements and acceptance criteria

### During Development

1. **Immediately log user prompts verbatim** in `prompts-log.md` with current local timestamp
2. Update task notes with implementation decisions via PMaC CLI
3. **Create ADRs for architectural decisions** following the standard template and process
4. Follow technical requirements exactly

### Timestamp Standards

**All PMaC files must use consistent local timezone format:**

- **Format**: `YYYY-MM-DD HH:MM:SS a.m./p.m. EDT` (e.g., "2025-06-24 03:25:00 p.m. EDT")
- **Source**: JavaScript `new Date().toLocaleString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'}).replace(',', '')`
- **Application**: Both prompts-log.md manual entries and PMaC CLI automated timestamps

### Before Committing

1. Validate ALL acceptance criteria are met
2. Update task status and add milestone notes via PMaC CLI
3. Commit PMaC files with code changes
4. Include task ID in commit message

### File Separation Guidelines

**prompts-log.md**:

- User prompts ONLY, verbatim
- Minimal context, just timestamp and prompt text
- No analysis, decisions, or implementation details

**project-backlog.yml** (via PMaC CLI):

- Implementation decisions and rationale
- Technical milestones and progress notes
- Architecture decisions and trade-offs
- ADR creation and references
- Test results and validation status

## Git Integration

```bash
# Feature branches
git checkout -b feature/TASK-001-description

# Commit with task ID
git commit -m "TASK-001: Implement feature XYZ

✅ All acceptance criteria met
📝 Updated PMaC files"

# PR titles reference tasks
"TASK-001: Implementation of JWT authentication"
```

## File Structure

```
project-root/
├── project-management-as-code.md    # This methodology
├── project-backlog.yml               # Task management
├── prompts-log.md                    # Decision log
├── project-requirements.md           # Technical specs
├── CLAUDE.md                         # AI instructions
├── tools/pmac.ts                     # CLI tool (optional)
└── src/                             # Application code
```

## Quality Standards

- **Tests**: 100% coverage on new code, all tests pass
- **Dependencies**: Validate with `pmac validate`
- **Documentation**: Update with all code changes
- **Security**: Input validation, secure patterns, audit logs

## Task Structure Example

```yaml
# project-backlog.yml
phases:
  development:
    tasks:
      - id: AUTH-001
        title: "Implement JWT Authentication"
        status: "ready"
        priority: "high"
        estimated_hours: 8
        requirements:
          - "Create JWT token generation endpoint"
          - "Implement token validation middleware"
        acceptance_criteria:
          - "✅ Users can login and receive valid tokens"
          - "✅ Protected routes validate tokens correctly"
          - "✅ All tests pass with >95% coverage"
        dependencies: ["SETUP-001"]
```

## PMaC vs Traditional PM

| Aspect           | Traditional Tools  | PMaC                  |
| ---------------- | ------------------ | --------------------- |
| AI Integration   | Manual/None        | Native                |
| Decision Context | Lost               | Complete              |
| Version Control  | External           | Full Integration      |
| Audit Trail      | Platform-dependent | Git + prompts + tasks |
| Quality Control  | External processes | Built-in protocols    |

## PMaC CLI Tool

Optional CLI tool available as NPM package for enhanced workflows:

```bash
# Installation
npm install -g pmac-cli

# Key Commands
pmac list [status] [priority]    # List filtered tasks
pmac update TASK-001 in_progress # Update status
pmac validate                     # Check dependencies
pmac critical-path                # Show critical path
pmac viewer                       # Launch interactive viewer
```

📚 **Full CLI Documentation**: See [PMaC CLI repository](https://github.com/andersonjc/pmac-cli) for complete features and commands.

## Getting Started

1. **Get Templates**: Copy PMaC template files from this repository to your project root
2. **Optional CLI**: Install `npm install -g pmac-cli` for easy setup and enhanced task management
3. **Customize**: Update files to match your project requirements
4. **Start Working**: Pick tasks from `project-backlog.yml` and follow PMaC workflow

## Best Practices

**Task Definition:**

- Write specific, testable acceptance criteria
- Include testing requirements
- Reference technical requirements
- Estimate effort realistically

**Documentation:**

- Log every AI prompt in `prompts-log.md`
- Document architectural decisions
- Update PMaC files with code changes
- Use task IDs in commits and branches

**Quality:**

- Follow Senior Engineer Protocol for every task
- Validate all criteria before marking complete
- Run tests, lint, build before committing
- Maintain 100% test coverage on new code

## Common Pitfalls

- **Skipping PMaC updates** → Use Git hooks to enforce
- **Vague criteria** → Write specific, measurable outcomes
- **Incomplete logging** → Log every interaction verbatim
- **Poor dependencies** → Use CLI validation to prevent cycles

## Acknowledgments

This methodology was inspired by Max Mitchell's concept of "prompts as source code" from his analysis of [Cloudflare's Claude-generated commits](https://www.maxemitchell.com/writings/i-read-all-of-cloudflares-claude-generated-commits/).

The independent emergence of similar concepts, such as the [PMAC project](https://github.com/schneidergithub/pmac) by schneidergithub, demonstrates the industry's shared need for standardized AI-assisted development practices.

---

**License**: MIT - Encouraging adoption and contribution to AI-assisted development standards.
