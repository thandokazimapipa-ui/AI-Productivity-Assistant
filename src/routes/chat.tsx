import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Halo" },
      {
        name: "description",
        content: "Chat with the Halo workplace assistant about drafting, planning and prioritizing.",
      },
      { property: "og:title", content: "AI Chatbot — Halo" },
      {
        property: "og:description",
        content: "Chat with the Halo workplace assistant about drafting, planning and prioritizing.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Help me prioritize my week across three projects.",
  "Rewrite this update so it sounds more confident.",
  "What should I ask in a vendor renewal call?",
];

function ChatPage() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error) => toast.error(error.message || "The assistant could not reply."),
  });

  useEffect(() => {
    if (status === "ready") textareaRef.current?.focus();
  }, [status]);

  const busy = status === "submitted" || status === "streaming";

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    await sendMessage({ text: trimmed });
  }

  return (
    <>
      <header className="animate-rise">
        <div className="label-micro">Tools / Chat</div>
        <h1 className="text-2xl font-extrabold tracking-tight">AI Chatbot</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A running conversation about your work. This chat is not saved — it resets when you leave.
        </p>
      </header>

      <div className="panel animate-rise flex h-[65vh] min-h-[28rem] flex-col rounded-2xl p-4">
        <Conversation className="flex-1">
          <ConversationContent className="gap-4">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Ask the assistant anything about your work"
                description="Drafting, summarizing, planning, prioritizing or thinking a problem through."
              >
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full bg-card/70 px-3 py-1.5 text-xs text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </ConversationEmptyState>
            ) : null}

            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <MessageResponse key={index}>{part.text}</MessageResponse>
                    ) : null
                  )}
                </MessageContent>
              </Message>
            ))}

            {status === "submitted" ? <Shimmer>Thinking…</Shimmer> : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          className="mt-3"
          onSubmit={(message, event) => {
            event.preventDefault();
            const text = message.text ?? input;
            console.log("SUBMIT", JSON.stringify(text), status);
            if (textareaRef.current) textareaRef.current.value = "";
            void send(text);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            autoFocus
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about drafting, planning or prioritizing…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} disabled={status === "submitted"} />
          </PromptInputFooter>
        </PromptInput>

        <p className="mt-2 text-[11px] text-muted-foreground">
          Replies are AI-generated and may be wrong. Verify anything important.
        </p>
      </div>
    </>
  );
}
