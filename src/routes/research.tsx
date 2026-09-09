import { createFileRoute } from "@tanstack/react-router";

import { ToolHeader, ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/tools";

const tool = getTool("research");

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Halo" },
      {
        name: "description",
        content: "Synthesize any work topic into a structured brief with findings and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant — Halo" },
      {
        property: "og:description",
        content: "Synthesize any work topic into a structured brief with findings and next steps.",
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
