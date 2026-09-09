import { createFileRoute } from "@tanstack/react-router";

import { ToolHeader, ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/tools";

const tool = getTool("email");

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Halo" },
      {
        name: "description",
        content: "Generate polished, ready-to-send work emails from recipient, tone and key points.",
      },
      { property: "og:title", content: "Smart Email Generator — Halo" },
      {
        property: "og:description",
        content: "Generate polished, ready-to-send work emails from recipient, tone and key points.",
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
