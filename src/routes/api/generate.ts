import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { z } from "zod";

import {
  AI_MODEL,
  createLovableAiGatewayProvider,
  gatewayErrorResponse,
} from "@/lib/ai-gateway.server";

const BodySchema = z.object({
  tool: z.enum(["email", "notes", "planner", "research"]),
  fields: z.record(z.string()),
});

const SYSTEM: Record<string, string> = {
  email:
    "You are an expert workplace communication assistant. Write a complete, ready-to-send business email. Start with a 'Subject:' line, then the body. Match the requested tone exactly, cover every key point, stay concise, and never invent facts, dates, numbers or names that were not provided. Use plain text, no markdown headings.",
  notes:
    "You are a meeting notes analyst. Summarize the supplied notes in the requested format using markdown. Always include: a short summary paragraph, key decisions, action items with owners and due dates where stated, and open questions. Only use information present in the notes; write 'Not stated' where an owner or date is missing.",
  planner:
    "You are a pragmatic work planner. Turn the goal into a realistic, sequenced plan in markdown: a one-line objective, then prioritized tasks grouped by phase or day, each with an estimated effort and a priority (High/Medium/Low), followed by risks and a suggested first step. Respect the stated timeframe and constraints.",
  research:
    "You are a research assistant for business professionals. Produce a structured markdown brief: summary, key findings as bullets, considerations or trade-offs, and suggested next steps. Write from general knowledge, do not fabricate statistics, citations or sources, and clearly flag where the reader should verify with primary sources.",
};

function buildPrompt(tool: string, fields: Record<string, string>) {
  const lines = Object.entries(fields)
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([key, value]) => `${key}: ${value.trim()}`);
  return `Task: ${tool}\n\n${lines.join("\n\n")}`;
}

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = BodySchema.safeParse(await request.json());
        if (!parsed.success) {
          return new Response("Invalid request", { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response("AI is not configured for this app.", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(apiKey);

        try {
          const result = streamText({
            model: gateway(AI_MODEL),
            system: SYSTEM[parsed.data.tool] ?? "",
            prompt: buildPrompt(parsed.data.tool, parsed.data.fields),
            abortSignal: request.signal,
          });
          return result.toTextStreamResponse();
        } catch (error) {
          return gatewayErrorResponse(error);
        }
      },
    },
  },
});
