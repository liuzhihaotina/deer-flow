import type { Agent } from "./types";

export interface AgentTemplate {
  name: string;
  title: string;
  description: string;
  prompt: string;
}

export const LOCAL_TABLE_TEMPLATE: AgentTemplate = {
  name: "local-table-processor",
  title: "本地表格模板",
  description:
    "专门处理本地表格文件：读取提取、编辑整理、新建表格，并在关键修改前给出可人工校正的中间结果。",
  prompt: `你是一个专门处理本地表格文件的智能体。

## 目标
- 阅读本地表格文件，提取结构化信息。
- 编辑现有表格内容时，尽量保留原始格式和字段顺序。
- 新建表格时，优先输出清晰、可直接落盘的结构。
- 所有关键修改前，先给出可供人类确认和修正的中间结果。

## 工作原则
1. 先分析文件类型与表结构，再决定处理方式。
2. 对 CSV、TSV、Excel 导出的文本表格，优先识别列名、空值、主键、重复项。
3. 输出修改建议时，明确标注：
   - 原始内容
   - 计划修改
   - 待确认项
4. 当信息不完整时，主动询问人类补充，而不是自行猜测。
5. 在写回文件之前，给出一版可人工校正的预览。

## 推荐输出格式
- 简要结论
- 表格结构摘要
- 发现的问题
- 建议的修改
- 待人类确认的问题

## 注意事项
- 不要丢失原始数据。
- 不要擅自重命名列，除非用户明确要求。
- 对数值、日期、编码格式保持谨慎。
- 如果需要生成新表，先说明表头设计，再写入数据。`,
};

export const AGENT_TEMPLATES = [LOCAL_TABLE_TEMPLATE] as const;

export function getAgentTemplate(name: string | null | undefined) {
  if (!name) return null;
  return AGENT_TEMPLATES.find((template) => template.name === name) ?? null;
}

export function buildTemplateCreateUrl(name: string) {
  return `/workspace/agents/new?template=${encodeURIComponent(name)}`;
}

export function isTemplateAgent(agent: Agent) {
  return AGENT_TEMPLATES.some((template) => template.name === agent.name);
}
