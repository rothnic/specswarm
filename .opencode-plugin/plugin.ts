/**
 * SpecSwarm OpenCode Plugin
 *
 * This plugin provides the same functionality as the Claude Code plugin,
 * adapted for the OpenCode runtime environment.
 *
 * ATTRIBUTION CHAIN:
 * 1. Original: GitHub spec-kit (https://github.com/github/spec-kit)
 *    Copyright (c) GitHub, Inc. | MIT License
 * 2. Adapted: SpecKit plugin by Marty Bonacci (2025)
 * 3. Forked: SpecSwarm plugin with tech stack management
 *    by Marty Bonacci & Claude Code (2025)
 * 4. OpenCode Support: Added for dual-runtime support
 */

import path from "node:path";
import type { Plugin } from "@opencode-ai/plugin";
import { readFileSync, existsSync } from "node:fs";

/**
 * Helper to log messages with consistent formatting
 */
function pluginLog(message: string): void {
  console.log(`[SpecSwarm] ${message}`);
}

/**
 * Load command definitions from the commands directory
 * Commands are markdown files that define slash command behavior
 */
function loadCommands(pluginDir: string): Map<string, string> {
  const commandsDir = path.join(pluginDir, "commands");
  const commands = new Map<string, string>();

  if (!existsSync(commandsDir)) {
    pluginLog("Commands directory not found");
    return commands;
  }

  const files = require("fs").readdirSync(commandsDir);
  for (const file of files) {
    if (file.endsWith(".md")) {
      const commandName = file.replace(".md", "");
      const content = readFileSync(path.join(commandsDir, file), "utf-8");
      commands.set(commandName, content);
    }
  }

  pluginLog(`Loaded ${commands.size} commands`);
  return commands;
}

/**
 * Load skill definitions from the skills directory
 * Skills are SKILL.md files that define natural language triggers
 */
function loadSkills(pluginDir: string): Map<string, string> {
  const skillsDir = path.join(pluginDir, "skills");
  const skills = new Map<string, string>();

  if (!existsSync(skillsDir)) {
    pluginLog("Skills directory not found");
    return skills;
  }

  const dirs = require("fs").readdirSync(skillsDir);
  for (const dir of dirs) {
    const skillFile = path.join(skillsDir, dir, "SKILL.md");
    if (existsSync(skillFile)) {
      const content = readFileSync(skillFile, "utf-8");
      skills.set(dir, content);
    }
  }

  pluginLog(`Loaded ${skills.size} skills`);
  return skills;
}

/**
 * Parse session ID from various event formats
 */
function resolveSessionID(
  client: any,
  event: unknown
): string | null {
  const evtAny = event as {
    sessionID?: string;
    data?: { sessionID?: string };
  } | undefined;
  return evtAny?.sessionID ?? evtAny?.data?.sessionID ?? null;
}

/**
 * Get the last message from a session for context
 */
async function getSessionContext(
  client: any,
  sessionID: string
): Promise<string> {
  try {
    const history = await client.session.messages({
      path: { id: sessionID },
    });
    const messages = (history as { data: unknown[] }).data || [];
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      const text =
        (lastMsg as { parts: { type: string; text: string }[] }).parts?.find(
          (p) => p.type === "text"
        )?.text || "(No text content)";
      return text.slice(0, 500) + (text.length > 500 ? "..." : "");
    }
  } catch {
    return "(Could not fetch context)";
  }
  return "(No messages)";
}

/**
 * SpecSwarm OpenCode Plugin
 *
 * Provides spec-driven development workflows for OpenCode:
 * - /specswarm:init - Initialize project configuration
 * - /specswarm:build - Build features from specification
 * - /specswarm:fix - Systematic bugfix workflow
 * - /specswarm:modify - Modify existing features
 * - /specswarm:ship - Quality validation and merge
 * - And 27 more commands...
 */
const SpecSwarmPlugin: Plugin = async ({ client: opencodeClient, directory }) => {
  const lastSessionID = { value: null as string | null };

  // Derive workspace name from plugin directory
  const WORKSPACE_NAME = path.basename((directory as string) ?? process.cwd());

  // Get the plugin directory (parent of .opencode-plugin)
  const pluginDir = path.dirname(directory as string);

  // Load commands and skills
  const commands = loadCommands(pluginDir);
  const skills = loadSkills(pluginDir);

  pluginLog(`Initialized for workspace: ${WORKSPACE_NAME}`);
  pluginLog(`Plugin directory: ${pluginDir}`);

  return {
    /**
     * Event handler for OpenCode session events
     *
     * Supported events:
     * - session.start: New session started
     * - session.idle: Session waiting for user input
     * - session.message: New message in session
     * - session.end: Session ended
     */
    event: async ({ event }) => {
      const evType = (event as { type?: string }).type;
      const sessionID = resolveSessionID(opencodeClient, event);

      // Log events for debugging
      pluginLog(`Event: ${String(evType)} sessionID=${String(sessionID)}`);

      // Handle session start
      if (evType === "session.start") {
        pluginLog(`Session started for workspace=${WORKSPACE_NAME}`);
        if (sessionID) {
          lastSessionID.value = sessionID;
        }
      }

      // Handle session idle (waiting for input)
      if (evType === "session.idle") {
        pluginLog(`Session idle for workspace=${WORKSPACE_NAME}`);
        if (sessionID) {
          lastSessionID.value = sessionID;

          // Get context for the idle notification
          const context = await getSessionContext(opencodeClient, sessionID);

          // Log the idle state with context
          pluginLog(`Session ${sessionID} is idle. Last output:`);
          pluginLog(context);
        }
      }

      // Handle messages (for natural language command detection)
      if (evType === "session.message") {
        const msgEvent = event as {
          data?: { content?: string };
        };
        const content = msgEvent?.data?.content;

        if (content) {
          // Check for slash commands
          const slashMatch = content.match(/^\/specswarm:(\w+)/);
          if (slashMatch) {
            const commandName = slashMatch[1];
            if (commands.has(commandName)) {
              pluginLog(`Executing command: /specswarm:${commandName}`);
              // Command execution is handled by OpenCode's built-in command system
            }
          }
        }
      }
    },

    /**
     * Expose commands to OpenCode
     *
     * Each command from commands/*.md is exposed as /specswarm:<name>
     */
    commands: Array.from(commands.entries()).map(([name, content]) => {
      // Parse frontmatter for description
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      let description = `SpecSwarm ${name} command`;

      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const descMatch = frontmatter.match(/description:\s*(.+)/);
        if (descMatch) {
          description = descMatch[1].trim();
        }
      }

      return {
        name: `specswarm:${name}`,
        description,
        handler: async (args: { arguments?: string }) => {
          // The command content is markdown that describes the workflow
          // OpenCode will interpret and execute the workflow steps
          return {
            type: "markdown" as const,
            content: content.replace("$ARGUMENTS", args.arguments || ""),
          };
        },
      };
    }),

    /**
     * Expose skills for natural language detection
     *
     * Skills are loaded from skills/*/SKILL.md
     */
    skills: Array.from(skills.entries()).map(([name, content]) => {
      // Parse frontmatter for skill metadata
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      let skillName = name;
      let description = `SpecSwarm ${name} skill`;

      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const nameMatch = frontmatter.match(/name:\s*(.+)/);
        const descMatch = frontmatter.match(/description:\s*(.+)/);
        if (nameMatch) skillName = nameMatch[1].trim();
        if (descMatch) description = descMatch[1].trim();
      }

      return {
        name: skillName,
        description,
        content,
      };
    }),
  };
};

export default SpecSwarmPlugin;
