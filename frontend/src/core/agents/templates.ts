import { getAgent } from "./api";
import type { Agent } from "./types";
import { localTableProcessorTemplate } from "./template-presets/local-table-processor";
import { msgInputLoggerTemplate } from "./template-presets/msg-input-logger";

export interface AgentTemplate {
  name: string;
  title: string;
  description: string;
  prompt: string;
}

const LOCAL_AGENT_TEMPLATES: Record<string, AgentTemplate> = {
  [localTableProcessorTemplate.name]: localTableProcessorTemplate,
  [msgInputLoggerTemplate.name]: msgInputLoggerTemplate,
};

export function listLocalAgentTemplates(): AgentTemplate[] {
  return Object.values(LOCAL_AGENT_TEMPLATES);
}

export function getLocalAgentTemplate(
  name: string | null | undefined,
): AgentTemplate | null {
  if (!name) return null;
  return LOCAL_AGENT_TEMPLATES[name] ?? null;
}

export async function loadAgentTemplate(
  name: string | null | undefined,
): Promise<AgentTemplate | null> {
  const localTemplate = getLocalAgentTemplate(name);
  if (localTemplate) {
    return localTemplate;
  }

  if (!name) return null;

  try {
    const agent = await getAgent(name);
    if (!agent.soul && !agent.description && !agent.model && !agent.tool_groups && !agent.skills) {
      return null;
    }

    return {
      name: agent.name,
      title: agent.description?.trim() || agent.name,
      description: agent.description || "",
      prompt: agent.soul ?? "",
    };
  } catch {
    return null;
  }
}

export function buildTemplateCreateUrl(name: string) {
  return `/workspace/agents/new?template=${encodeURIComponent(name)}`;
}

export function isTemplateAgent(agent: Agent) {
  return Boolean(agent.template);
}


