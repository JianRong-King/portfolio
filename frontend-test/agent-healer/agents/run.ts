import { query, type Options, type SDKMessage, type SDKResultMessage } from "@anthropic-ai/claude-agent-sdk";

export type AgentRun = {
  result: SDKResultMessage;
  costUsd: number;
};

function describeToolUse(input: Record<string, unknown>): string {
  return String(input.file_path ?? input.pattern ?? input.path ?? "");
}

function logProgress(label: string, message: SDKMessage): void {
  if (message.type !== "assistant") return;
  for (const block of message.message.content) {
    if (block.type === "tool_use") {
      console.error(`[${label}] ${block.name} ${describeToolUse(block.input as Record<string, unknown>)}`);
    }
  }
}

export async function runAgent(label: string, prompt: string, options: Options): Promise<AgentRun> {
  let result: SDKResultMessage | undefined;
  try {
    for await (const message of query({ prompt, options })) {
      logProgress(label, message);
      if (message.type === "result") result = message;
    }
  } catch (error) {
    if (!result) throw error;
  }
  if (!result) throw new Error("Agent ended without a result message");
  console.error(`[${label}] ${result.subtype}, ${result.num_turns} turns, $${result.total_cost_usd.toFixed(4)}`);
  return { result, costUsd: result.total_cost_usd };
}

export const readTools = ["Read", "Glob", "Grep"];
export const editTools = [...readTools, "Edit", "Write"];
export const blockedTools = ["Bash", "NotebookEdit", "WebFetch", "WebSearch", "Task"];
