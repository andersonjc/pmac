# [Your Project Name]

[Brief, compelling description of what your project does and why it matters]

## Project Management as Code (PMaC)

This project follows the **Project Management as Code (PMaC)** methodology for AI-assisted development. All project management data is version-controlled alongside the codebase.

### PMaC Files

- **`project-management-as-code.md`** - Complete PMaC methodology documentation
- **`project-backlog.yml`** - Task management, dependencies, and progress tracking
- **`prompts-log.md`** - Complete conversation history and decision audit trail
- **`CLAUDE.md`** - AI assistant instructions and project-specific guidance
- **`[project]-requirements.md`** - Technical requirements and architecture specifications

These files work together to maintain complete project context and enable seamless AI-assisted development.

## Quick Start

### Prerequisites

- [List your project's prerequisites, e.g., Node.js 18+, Python 3.9+, etc.]
- [Package manager: pnpm, npm, yarn, pip, etc.]
- [Database requirements]
- [Other tools or services]

### Installation

```bash
# Clone the repository
git clone https://github.com/[username]/[repository].git
cd [repository]

# Install dependencies
[your install command, e.g., pnpm install, pip install -r requirements.txt]

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations (if applicable)
[your migration command]

# Start development server
[your dev command, e.g., pnpm dev]
```

### PMaC CLI (Project Management)

Install the PMaC CLI for enhanced project management:

```bash
# Install PMaC CLI globally (recommended)
npm install -g pmac-cli

# View current tasks
pmac list

# Update task status
pmac update TASK-001 in_progress "Starting implementation"

# Launch interactive viewer
pmac viewer

# View critical path
pmac critical-path

# See all available commands
pmac help
```

📚 **Full CLI Documentation**: [PMaC CLI Repository](https://github.com/andersonjc/pmac-cli)

## Architecture Overview

[Include a brief architecture description and diagram]

### Technology Stack

- **[Category]**: [Technology and version]
- **[Category]**: [Technology and version]
- **[Category]**: [Technology and version]

[Link to detailed technical requirements: `[project]-requirements.md`]

## Development

### Getting Started with PMaC

1. **Read the methodology**: Start with `project-management-as-code.md`
2. **Check current tasks**: Review `project-backlog.yml` for ready tasks
3. **Follow the workflow**: Update task status as you work
4. **Log decisions**: Document all technical decisions in `prompts-log.md`
5. **Commit PMaC files**: Always commit PMaC files with code changes

### Development Commands

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm test         # Run all tests

# Code Quality
pnpm lint         # Run linting
pnpm format       # Format code
pnpm typecheck    # Type checking (if using TypeScript)

# PMaC Management (requires: npm install -g pmac-cli)
pmac list    # View tasks
pmac help    # PMaC CLI help
```

### Testing

[Describe your testing strategy and how to run tests]

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:unit
pnpm test:integration
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

## Project Structure

```
[project-name]/
├── project-management-as-code.md    # PMaC methodology
├── project-backlog.yml              # Task management
├── prompts-log.md                   # Decision log
├── CLAUDE.md                        # AI instructions
├── [project]-requirements.md        # Technical requirements
├── [src/app/lib/etc.]/              # Application code
├── tests/                           # Test files
├── docs/                            # Additional documentation
└── README.md                        # This file
```

## Contributing

### PMaC Workflow for Contributors

1. **Review PMaC files**: Understand current project state
2. **Choose a task**: Pick a "ready" task from `project-backlog.yml`
3. **Create feature branch**: `git checkout -b feature/TASK-ID-description`
4. **Update task status**: Mark as "in_progress" using PMaC CLI (`pmac update TASK-ID in_progress`)
5. **Implement changes**: Follow acceptance criteria exactly
6. **Update PMaC files**: Document decisions and update task status
7. **Create pull request**: Include PMaC file updates

### Code Standards

- [Your coding standards and conventions]
- [Linting and formatting requirements]
- [Testing requirements]
- [Documentation standards]

### Pull Request Process

1. Ensure all tests pass
2. Update relevant documentation
3. Include PMaC file updates in your PR
4. Reference the task ID in your PR title
5. Validate acceptance criteria are met

## Deployment

[Describe your deployment process]

### Environments

- **Development**: [Description and URL if applicable]
- **Staging**: [Description and URL if applicable]
- **Production**: [Description and URL if applicable]

### Deployment Commands

```bash
# Deploy to staging
[staging deployment command]

# Deploy to production
[production deployment command]
```

## Monitoring & Operations

[Describe monitoring, logging, and operational procedures]

- **Monitoring**: [Monitoring setup and dashboards]
- **Logs**: [How to access and interpret logs]
- **Alerts**: [Alert system and escalation procedures]

## API Documentation

[If your project has an API, link to documentation]

- **API Docs**: [Link to API documentation]
- **Postman Collection**: [Link if available]
- **OpenAPI/Swagger**: [Link if available]

## Support & Community

### Getting Help

- **Documentation**: Check `docs/` directory and PMaC files
- **Issues**: [Link to issue tracker]
- **Discussions**: [Link to discussions if applicable]

### Reporting Issues

1. Check existing issues first
2. Use issue templates if available
3. Include relevant PMaC context (task IDs, etc.)
4. Provide clear reproduction steps

## License

[Specify your license - adjust based on your project]

This project is licensed under the [License Name] - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built using [Project Management as Code (PMaC)](project-management-as-code.md) methodology
- [Other acknowledgments, credits, or inspirations]

---

## PMaC Implementation Notes

This README is part of the PMaC methodology implementation. It provides the entry point for understanding the project while directing readers to the comprehensive PMaC documentation system.

**For AI Assistants**: Always review `CLAUDE.md` and `project-backlog.yml` before beginning work on this project.

**For New Team Members**: Start with `project-management-as-code.md` to understand the development methodology, then review `[project]-requirements.md` for technical context.

<!-- Template Usage Instructions:
1. Replace [bracketed placeholders] with your project-specific information
2. Update technology stack and architecture sections
3. Customize installation and setup instructions
4. Add project-specific development and deployment commands
5. Include relevant API documentation links
6. Adjust support and community sections based on your project type
7. Choose appropriate license and update license section
8. Remove these template usage instructions when complete
9. Ensure all PMaC file references are accurate
10. Keep this README synchronized with project evolution
11. Test all commands and links before publishing
12. Consider adding badges, screenshots, or demos as appropriate
-->
