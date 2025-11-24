# SpecSwarm OpenCode Plugin

This directory contains the OpenCode plugin configuration for SpecSwarm.

## Overview

SpecSwarm supports both **Claude Code** and **OpenCode** runtimes. This plugin provides the same functionality across both platforms, allowing you to use SpecSwarm with your preferred AI coding assistant.

## Installation

### For OpenCode

1. Install the plugin:
```bash
opencode plugin install specswarm
```

2. Or add to your `.opencode/config.json`:
```json
{
  "plugins": [
    {
      "name": "specswarm",
      "source": "github:MartyBonacci/specswarm",
      "enabled": true
    }
  ]
}
```

3. Restart OpenCode to activate the plugin.

## Plugin Structure

```
.opencode-plugin/
├── plugin.json    # Plugin metadata and configuration
├── plugin.ts      # Main plugin entry point
└── README.md      # This file
```

## How It Works

The OpenCode plugin:

1. **Loads Commands**: Reads all command definitions from `commands/*.md`
2. **Loads Skills**: Reads skill definitions from `skills/*/SKILL.md`
3. **Exposes Slash Commands**: Makes `/specswarm:*` commands available
4. **Handles Events**: Responds to session lifecycle events

## Commands

All SpecSwarm commands are available in OpenCode:

### Core Commands (5)
- `/specswarm:init` - Initialize project configuration
- `/specswarm:build` - Build features from specification
- `/specswarm:fix` - Systematic bugfix workflow
- `/specswarm:modify` - Modify existing features
- `/specswarm:ship` - Quality validation and merge

### Advanced Commands (27+)
See [COMMANDS.md](../COMMANDS.md) for the complete command reference.

## Natural Language Support

OpenCode's natural language processing works with SpecSwarm skills:

```
"Build user authentication"     → /specswarm:build
"Fix the login bug"             → /specswarm:fix
"Change auth to use JWT"        → /specswarm:modify
"Ship this feature"             → /specswarm:ship (with confirmation)
```

## Event Handling

The plugin responds to OpenCode session events:

| Event | Handler |
|-------|---------|
| `session.start` | Initializes session tracking |
| `session.idle` | Logs context for debugging |
| `session.message` | Detects commands and skills |
| `session.end` | Cleanup session state |

## Configuration

### Environment Variables

Set in `~/.config/opencode/.env`:

```bash
# Optional: Enable debug logging
SPECSWARM_DEBUG=true

# Optional: Custom workspace name
SPECSWARM_WORKSPACE=my-project
```

### Project Configuration

SpecSwarm uses the same configuration files regardless of runtime:

```
.specswarm/
├── constitution.md       # Project governance
├── tech-stack.md         # Approved technologies
└── quality-standards.md  # Quality gates
```

## Differences from Claude Code

| Feature | Claude Code | OpenCode |
|---------|-------------|----------|
| Plugin Format | `.claude-plugin/` | `.opencode-plugin/` |
| Plugin Language | Markdown only | TypeScript + Markdown |
| Event System | N/A | Full event handling |
| SDK Access | Limited | Full SDK access |
| Session Management | Automatic | Plugin-controlled |

## Development

### Building the Plugin

```bash
# Install dependencies (if any)
npm install

# Compile TypeScript
npx tsc .opencode-plugin/plugin.ts --outDir .opencode-plugin/dist
```

### Testing

```bash
# Run in development mode
opencode --plugin-dev ./
```

## Troubleshooting

### Plugin Not Loading

1. Check plugin.json syntax:
```bash
cat .opencode-plugin/plugin.json | jq .
```

2. Verify TypeScript compiles:
```bash
npx tsc .opencode-plugin/plugin.ts --noEmit
```

3. Check OpenCode logs:
```bash
opencode logs --level debug
```

### Commands Not Available

1. Ensure commands directory exists:
```bash
ls -la commands/
```

2. Check command file format (must have YAML frontmatter):
```markdown
---
description: Command description here
---
```

### Skills Not Triggering

1. Verify skills directory structure:
```bash
ls -la skills/*/SKILL.md
```

2. Check SKILL.md frontmatter format:
```markdown
---
name: specswarm-build
description: Natural language triggers...
---
```

## License

MIT License - See LICENSE file for details.

## Support

- **Repository**: https://github.com/MartyBonacci/specswarm
- **Issues**: https://github.com/MartyBonacci/specswarm/issues
- **Documentation**: [docs/README.md](../docs/README.md)
