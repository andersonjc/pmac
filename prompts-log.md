# PMaC Repository Separation - Prompts Log

## 2025-01-21 03:05:37 PST

**User Prompt:**
> Begin, adhering to PMaC. Log prompts into the new pmac-cli repo, once it's set up.

**Context:** Starting Phase 0 of STANDALONE_PACKAGE_IMPLEMENTATION_PLAN.md - Repository Setup and Migration to separate PMaC methodology from CLI tooling into distinct repositories.

**Phase 0 Status:**
- ✅ Created pmac-cli repository from feature/PMaC-Backlog-Viewer branch
- ✅ Set up GitHub repository: https://github.com/andersonjc/pmac-cli
- ✅ Returned original pmac repository to master branch (clean methodology focus)
- ✅ Created feature/repository-separation branch for methodology repo updates
- ✅ Established prompts-log.md in both repositories
- ⏳ Next: Clean up working directory artifacts and establish cross-repository links

**Repository Structure Established:**
- **pmac**: Methodology repository (master branch - clean, minimal dependencies)
- **pmac-cli**: Tools repository (feature branch - complete tooling, viewer, build system)

**Implementation Task:** PHASE-0-REPO-SETUP - Repository separation complete, ready for Phase 1