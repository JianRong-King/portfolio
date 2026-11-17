import { query, type Options, type SDKMessage, type SDKResultMessage } from "@anthropic-ai/claude-agent-sdk";

export type AgentRun = {
  result: SDKResultMessage;
  costUsd: number;
};

function logProgress(label: string, message: SDKMessage): void {
  if (message.type === "assistant") {
    const u = message.message.usage;
    if (process.env.HEALER_DEBUG) console.error(`[${label}] call: in ${u.input_tokens} / cache write ${u.cache_creation_input_tokens} / cache read ${u.cache_read_input_tokens}`);
    for (const block of message.message.content) {
      if (block.type === "tool_use") console.error(`[${label}] ${block.name} ${JSON.stringify(block.input).slice(0, 200)}`);
    }
  }
  if (message.type === "user" && Array.isArray(message.message.content)) {
    for (const block of message.message.content) {
      if (block.type === "tool_result") console.error(`[${label}]   -> result ${JSON.stringify(block.content ?? "").length} chars`);
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
  const cost = result.total_cost_usd.toFixed(4);
  const { input_tokens, cache_creation_input_tokens, cache_read_input_tokens, output_tokens } = result.usage;
  const tokens = `in ${input_tokens} / cache write ${cache_creation_input_tokens} / cache read ${cache_read_input_tokens} / out ${output_tokens}`;
  console.error(`[${label}] ${result.subtype}, ${result.num_turns} turns, ${tokens}, $${cost}`);
  for (const [model, usage] of Object.entries(result.modelUsage ?? {})) {
    console.error(`[${label}]   ${model}: ${JSON.stringify(usage)}`);
  }
  return { result, costUsd: result.total_cost_usd };
}

export const readTools = ["Read", "Glob", "Grep"];
export const editTools = [...readTools, "Edit", "Write"];
export const blockedTools = ["Bash", "NotebookEdit", "WebFetch", "WebSearch", "Task"];
