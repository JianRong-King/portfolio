import { query, type Options, type SDKResultMessage } from "@anthropic-ai/claude-agent-sdk";

export type AgentRun = {
  result: SDKResultMessage;
  costUsd: number;
};

export async function runAgent(prompt: string, options: Options): Promise<AgentRun> {
  let result: SDKResultMessage | undefined;
  for await (const message of query({ prompt, options })) {
    if (message.type === "result") result = message;
  }
  if (!result) throw new Error("Agent ended without a result message");
  return { result, costUsd: result.total_cost_usd };
}

export const readTools = ["Read", "Glob", "Grep"];
export const editTools = [...readTools, "Edit", "Write"];
export const blockedTools = ["Bash", "NotebookEdit", "WebFetch", "WebSearch", "Task"];
