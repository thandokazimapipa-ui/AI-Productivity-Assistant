import { Link, createFileRoute } from "@tanstack/react-router";

import { TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Halo — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarize meetings, plan tasks and research topics with one AI workspace built for professionals.",
      },
      { property: "og:title", content: "Halo — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meetings, plan tasks and research topics with one AI workspace built for professionals.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Tools ready", value: "5", note: "email, notes, planning, research, chat" },
  { label: "Prompt style", value: "Structured", note: "guided fields, no blank page" },
  { label: "Outputs", value: "Editable", note: "rewrite anything before you use it" },
];

function Dashboard() {
  return (
    <>
      <header className="animate-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label-micro">Overview</div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            AI Workplace Productivity Assistant
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Pick a tool, fill in a short structured prompt, and get a draft you can edit and use
            straight away.
          </p>
        </div>
        <Link
          to="/chat"
          className="rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Open chatbot
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="panel animate-rise rounded-2xl p-4">
            <div className="label-micro">{stat.label}</div>
            <div className="mt-1 text-xl font-bold tracking-tight">{stat.value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-tight">Your tools</h2>
          <span className="font-mono text-[11px] text-muted-foreground">5 available</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="panel animate-rise rounded-2xl p-4 transition-all hover:ring-1 hover:ring-primary/30"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="grid size-7 place-items-center rounded-lg bg-primary/10 text-[13px] text-primary"
                  aria-hidden
                >
                  {tool.glyph}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{tool.tag}</span>
              </div>
              <div className="mb-1 text-sm font-semibold tracking-tight">{tool.name}</div>
              <p className="text-xs text-pretty text-muted-foreground">{tool.description}</p>
            </Link>
          ))}

          <Link
            to="/chat"
            className="panel animate-rise rounded-2xl p-4 transition-all hover:ring-1 hover:ring-primary/30"
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="grid size-7 place-items-center rounded-lg bg-primary/10 text-[13px] text-primary"
                aria-hidden
              >
                ◇
              </span>
              <span className="font-mono text-xs text-muted-foreground">Chat</span>
            </div>
            <div className="mb-1 text-sm font-semibold tracking-tight">AI Chatbot Interface</div>
            <p className="text-xs text-pretty text-muted-foreground">
              Ask follow-up questions in a running conversation.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
