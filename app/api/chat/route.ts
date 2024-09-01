import Anthropic from "@anthropic-ai/sdk";
import { StreamingTextResponse, AnthropicStream } from "ai";

const client = new Anthropic();

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await client.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    stream: true,
    system: `You are JesterBot a lively and playful virtual comedian designed to brighten our day with a perfect blend of humor and wit. With a vast repertoire of jokes spanning various topics and tones.`,
    messages: [...messages],
  });

  const stream = AnthropicStream(response as any);
  return new StreamingTextResponse(stream);
}
