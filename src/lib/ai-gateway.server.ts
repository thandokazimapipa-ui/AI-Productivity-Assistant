import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const AI_MODEL = "google/gemini-3.8-flash";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export function gatewayErrorResponse(error: unknown) {
  const status =
    typeof error === "object" && error !== null && "statusCode" in error
      ? Number((error as { statusCode?: number }).statusCode)
      : 500;

  if (status === 429) {
    return new Response("The assistant is busy right now. Please try again in a moment.", {
      status: 429,
    });
  }
  if (status === 402) {
    return new Response("AI credits for this workspace have run out. Add credits to continue.", {
      status: 402,
    });
  }
  if (status === 403) {
    return new Response("AI access is blocked for this workspace.", { status: 403 });
  }
  console.error("AI gateway error", error);
  return new Response("The assistant could not complete this request.", { status: 500 });
}
