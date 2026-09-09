import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import {
  AI_MODEL,
  createLovableAiGatewayProvider,
  gatewayErrorResponse,
} from "@/lib/ai-gateway.server";

const SYSTEM = `You are Halo, an AI workplace productivity assistant for busy professionals.
Help with drafting, summarizing, planning, prioritizing and researching work tasks.
Be concise and practical, use markdown with short sections and bullets, and ask a clarifying question when the request is ambiguous.
Never invent facts, names, dates or figures. Say clearly when something needs human verification, and remind the user not to share confidential data when it is relevant.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response("AI is not configured for this app.", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(apiKey);

        try {
          const result = streamText({
            model: gateway(AI_MODEL),
            system: SYSTEM,
            messages: await convertToModelMessages(messages),
            abortSignal: request.signal,
          });
          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (error) {
          return gatewayErrorResponse(error);
        }
      },
    },
  },
});
