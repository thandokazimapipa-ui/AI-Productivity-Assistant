import { createFileRoute } from "@tanstack/react-router";

import { ToolHeader, ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/tools";

const tool = getTool("planner");

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Halo" },
      {
        name: "description",
        content: "Break a goal into a sequenced, prioritized plan with effort estimates and risks.",
      },
      { property: "og:title", content: "AI Task Planner — Halo" },
      {
        property: "og:description",
        content: "Break a goal into a sequenced, prioritized plan with effort estimates and risks.",
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
