# SpecSwarm OpenCode Setup

This directory contains the OpenCode configuration for SpecSwarm.

## Overview

SpecSwarm supports both **Claude Code** and **OpenCode** runtimes. This configuration enables the same functionality across both platforms using OpenCode's native command system.

## Directory Structure

```
.opencode/
├── command/            # SpecSwarm commands (copied from commands/)
│   ├── specswarm:init.md
│   ├── specswarm:build.md
│   ├── specswarm:fix.md
│   ├── specswarm:modify.md
│   ├── specswarm:ship.md
│   └── ... (32 total commands)
└── README.md           # This file
```

## Installation

### Quick Start

1. **Install OpenCode CLI:**
   ```bash
   npm install -g opencode-ai
   ```

2. **Navigate to your project with SpecSwarm:**
   ```bash
   cd your-project-with-specswarm
   ```

3. **Start OpenCode:**
   ```bash
   opencode
   ```

4. **Initialize SpecSwarm (if not already done):**
   ```
   /specswarm:init
   ```

### Using Commands

All SpecSwarm commands are available with the `/specswarm:` prefix:

```bash
# Core Commands
/specswarm:init           # Initialize project configuration
/specswarm:build "desc"   # Build features from specification  
/specswarm:fix "desc"     # Systematic bugfix workflow
/specswarm:modify "desc"  # Modify existing features
/specswarm:ship           # Quality validation and merge

# Example usage
/specswarm:build "Add user authentication with JWT"
/specswarm:fix "Login button not working on mobile"
```

### Natural Language

You can also use natural language with OpenCode:

```
"Build user authentication with JWT"
"Fix the login bug"
"Ship this feature"
```

## Commands

SpecSwarm provides 32 commands for the complete software development lifecycle:

### Core Workflows (5)
- `/specswarm:init` - Initialize project configuration
- `/specswarm:build` - Build features from specification
- `/specswarm:fix` - Systematic bugfix workflow
- `/specswarm:modify` - Modify existing features
- `/specswarm:ship` - Quality validation and merge

### Feature Development (8)
- `/specswarm:specify` - Create feature specification
- `/specswarm:clarify` - Clarification questions
- `/specswarm:plan` - Generate implementation plan
- `/specswarm:tasks` - Break down into tasks
- `/specswarm:implement` - Execute implementation
- `/specswarm:checklist` - Create quality checklist
- `/specswarm:analyze` - Analyze code changes
- `/specswarm:constitution` - Project governance

### Bug & Issue Management (3)
- `/specswarm:bugfix` - Systematic bug fixing
- `/specswarm:hotfix` - Production hotfix
- `/specswarm:coordinate` - Multi-bug coordination

### Code Maintenance (2)
- `/specswarm:refactor` - Code refactoring
- `/specswarm:deprecate` - Deprecation management

### Quality & Analysis (6)
- `/specswarm:analyze-quality` - Quality analysis
- `/specswarm:impact` - Impact analysis
- `/specswarm:suggest` - Workflow suggestions
- `/specswarm:metrics` - Feature metrics
- `/specswarm:metrics-export` - Export metrics
- `/specswarm:validate` - Validation checks

### Lifecycle Management (5)
- `/specswarm:release` - Release management
- `/specswarm:security-audit` - Security audit
- `/specswarm:rollback` - Rollback changes
- `/specswarm:upgrade` - Dependency upgrades
- `/specswarm:complete` - Complete feature

### Orchestration (3)
- `/specswarm:orchestrate` - Basic orchestration
- `/specswarm:orchestrate-feature` - Feature orchestration
- `/specswarm:orchestrate-validate` - Validation orchestration

## Configuration

### Project Settings

The `.opencode/opencode.jsonc` file contains project-specific OpenCode settings:

```jsonc
{
  // Global settings
  "global": {
    "theme": "opencode"
  },

  // Instructions for the AI
  "instructions": "You are working in a SpecSwarm-enabled project..."
}
```

### SpecSwarm Settings

SpecSwarm configuration lives in `.specswarm/`:

```
.specswarm/
├── constitution.md       # Project governance
├── tech-stack.md         # Approved technologies
└── quality-standards.md  # Quality gates
```

## Differences from Claude Code

| Feature | Claude Code | OpenCode |
|---------|-------------|----------|
| Plugin Directory | `.claude-plugin/` | `.opencode/` |
| Commands Location | `commands/` | `.opencode/command/` |
| Config File | N/A | `.opencode/opencode.jsonc` |
| Installation | Marketplace | npm + copy commands |

Both platforms use the same:
- Command definitions (copied to appropriate location)
- Project configuration (`.specswarm/`)
- Workflow logic

## Troubleshooting

### Commands Not Found

Ensure the `.opencode/command/` directory exists with command files:

```bash
ls .opencode/command/
```

If missing, copy from the main commands directory:

```bash
for cmd in commands/*.md; do
  cp "$cmd" ".opencode/command/specswarm:$(basename $cmd)"
done
```

### OpenCode Not Recognizing Commands

Restart OpenCode to reload commands:

```bash
opencode
```

### Configuration Not Loading

Check the config file syntax:

```bash
cat .opencode/opencode.jsonc
```

## License

MIT License - See LICENSE file for details.

## Support

- **Repository**: https://github.com/MartyBonacci/specswarm
- **Issues**: https://github.com/MartyBonacci/specswarm/issues
- **Documentation**: [docs/README.md](../docs/README.md)
