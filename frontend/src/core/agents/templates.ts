import { getAgent } from "./api";
import type { Agent } from "./types";

export interface AgentTemplate {
  name: string;
  title: string;
  description: string;
  prompt: string;
}

export async function loadAgentTemplate(
  name: string | null | undefined,
): Promise<AgentTemplate | null> {
  if (!name) return null;

  const agent = await getAgent(name);
  return {
    name: agent.name,
    title: agent.description?.trim() || agent.name,
    description: agent.description || "",
    prompt: agent.soul ?? "",
  };
}

export function buildTemplateCreateUrl(name: string) {
  return `/workspace/agents/new?template=${encodeURIComponent(name)}`;
}

export function isTemplateAgent(agent: Agent) {
  return Boolean(agent.template);
}
