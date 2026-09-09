export type ToolField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  rows?: number;
};

export type ToolId = "email" | "notes" | "planner" | "research";

export type ToolConfig = {
  id: ToolId;
  path: "/email" | "/notes" | "/planner" | "/research";
  name: string;
  short: string;
  tag: string;
  glyph: string;
  description: string;
  outputLabel: string;
  fields: ToolField[];
};

export const TOOLS: ToolConfig[] = [
  {
    id: "email",
    path: "/email",
    name: "Smart Email Generator",
    short: "Smart Email",
    tag: "Email",
    glyph: "✉",
    description: "Draft polished emails from intent, tone, and key points.",
    outputLabel: "Editable draft",
    fields: [
      {
        name: "recipient",
        label: "Recipient",
        type: "text",
        placeholder: "Sarah Lund — Head of Design",
        required: true,
      },
      {
        name: "tone",
        label: "Tone",
        type: "select",
        options: ["Concise & warm", "Formal", "Direct", "Empathetic", "Persuasive"],
      },
      {
        name: "intent",
        label: "Intent",
        type: "select",
        options: [
          "Follow-up",
          "Request a decision",
          "Share an update",
          "Propose next steps",
          "Decline politely",
          "Introduction",
        ],
      },
      {
        name: "points",
        label: "Key points",
        type: "textarea",
        rows: 5,
        placeholder:
          "Confirm the Q3 handoff date, flag two open blockers, request a 15-minute sync this week.",
        required: true,
      },
    ],
  },
  {
    id: "notes",
    path: "/notes",
    name: "Meeting Notes Summarizer",
    short: "Notes Summarizer",
    tag: "Notes",
    glyph: "▤",
    description: "Condense transcripts into decisions and action items.",
    outputLabel: "Editable summary",
    fields: [
      {
        name: "title",
        label: "Meeting",
        type: "text",
        placeholder: "Product sync — 12 Sept",
      },
      {
        name: "format",
        label: "Summary format",
        type: "select",
        options: [
          "Decisions + action items",
          "Executive brief",
          "Detailed minutes",
          "Bullet highlights",
        ],
      },
      {
        name: "transcript",
        label: "Notes or transcript",
        type: "textarea",
        rows: 12,
        placeholder: "Paste raw notes or the meeting transcript here…",
        required: true,
      },
    ],
  },
  {
    id: "planner",
    path: "/planner",
    name: "AI Task Planner",
    short: "Task Planner",
    tag: "Planner",
    glyph: "✓",
    description: "Turn goals into sequenced, prioritized task lists.",
    outputLabel: "Editable plan",
    fields: [
      {
        name: "goal",
        label: "Goal or project",
        type: "textarea",
        rows: 4,
        placeholder: "Launch the new onboarding flow to 20% of users.",
        required: true,
      },
      {
        name: "timeframe",
        label: "Timeframe",
        type: "select",
        options: ["Today", "This week", "Two weeks", "This month", "This quarter"],
      },
      {
        name: "constraints",
        label: "Constraints & context",
        type: "textarea",
        rows: 4,
        placeholder: "Team of three, design sign-off pending, no releases on Fridays.",
      },
    ],
  },
  {
    id: "research",
    path: "/research",
    name: "AI Research Assistant",
    short: "Research",
    tag: "Research",
    glyph: "◔",
    description: "Synthesize a topic into a concise, structured brief.",
    outputLabel: "Editable brief",
    fields: [
      {
        name: "topic",
        label: "Topic or question",
        type: "textarea",
        rows: 4,
        placeholder: "How are mid-size teams measuring the ROI of AI writing tools?",
        required: true,
      },
      {
        name: "depth",
        label: "Depth",
        type: "select",
        options: ["Quick overview", "Standard brief", "Deep dive"],
      },
      {
        name: "audience",
        label: "Audience",
        type: "text",
        placeholder: "Operations leadership",
      },
    ],
  },
];

export const NAV_ITEMS = [
  { path: "/" as const, label: "Dashboard", glyph: "◧", group: "Overview" },
  ...TOOLS.map((t) => ({ path: t.path, label: t.short, glyph: t.glyph, group: "Tools" })),
  { path: "/chat" as const, label: "Chatbot", glyph: "◇", group: "Tools" },
];

export const DISCLAIMER =
  "Halo is a responsible-AI assistant. Every output is an AI-generated draft that can be incomplete or wrong — review facts, tone, and compliance, and keep confidential information out of prompts. You stay responsible for anything you send or publish.";

export function getTool(id: ToolId): ToolConfig {
  const tool = TOOLS.find((t) => t.id === id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}
