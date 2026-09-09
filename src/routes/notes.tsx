import { createFileRoute } from "@tanstack/react-router";

import { ToolHeader, ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/tools";

const tool = getTool("notes");

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Halo" },
      {
        name: "description",
        content: "Turn raw meeting notes or transcripts into decisions, action items and owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Halo" },
      {
        property: "og:description",
        content: "Turn raw meeting notes or transcripts into decisions, action items and owners.",
      },
    ],
  }),
  component: () => (
    <>
      <ToolHeader tool={tool} />
      <ToolWorkspace tool={tool} />
    </>
  ),
});
