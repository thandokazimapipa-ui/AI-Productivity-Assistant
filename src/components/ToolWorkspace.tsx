import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ToolConfig } from "@/lib/tools";

function initialValues(tool: ToolConfig) {
  const values: Record<string, string> = {};
  for (const field of tool.fields) {
    values[field.name] = field.type === "select" ? (field.options?.[0] ?? "") : "";
  }
  return values;
}

export function ToolWorkspace({ tool }: { tool: ToolConfig }) {
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(tool));
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const abortRef = useRef<AbortController | null>(null);

  const setValue = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  async function generate() {
    const missing = tool.fields.find((f) => f.required && !values[f.name]?.trim());
    if (missing) {
      toast.error(`Please fill in "${missing.label}" first.`);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("loading");
    setOutput("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: tool.id, fields: values }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        toast.error((await response.text()) || "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let text = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        text += value;
        setOutput(text);
      }
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") {
        toast.error("Could not reach the assistant. Please try again.");
      }
    } finally {
      setStatus("idle");
    }
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="panel animate-rise flex flex-col gap-4 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-tight">Structured prompt</h2>
          <span className="label-micro">Step 1 / 2</span>
        </div>

        <div className="space-y-3">
          {tool.fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={`${tool.id}-${field.name}`}
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                {field.label}
                {field.required ? <span className="text-primary"> *</span> : null}
              </label>

              {field.type === "text" ? (
                <Input
                  id={`${tool.id}-${field.name}`}
                  value={values[field.name] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => setValue(field.name, e.target.value)}
                  className="rounded-xl bg-card/70"
                />
              ) : null}

              {field.type === "textarea" ? (
                <Textarea
                  id={`${tool.id}-${field.name}`}
                  value={values[field.name] ?? ""}
                  placeholder={field.placeholder}
                  rows={field.rows ?? 4}
                  onChange={(e) => setValue(field.name, e.target.value)}
                  className="resize-y rounded-xl bg-card/70"
                />
              ) : null}

              {field.type === "select" ? (
                <Select
                  value={values[field.name] ?? ""}
                  onValueChange={(value) => setValue(field.name, value)}
                >
                  <SelectTrigger id={`${tool.id}-${field.name}`} className="rounded-xl bg-card/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>
          ))}
        </div>

        <Button
          onClick={generate}
          disabled={status === "loading"}
          className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/90"
        >
          {status === "loading" ? "Generating…" : "Generate →"}
        </Button>
      </section>

      <section className="panel animate-rise flex flex-col rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-tight">{tool.outputLabel}</h2>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={copy} disabled={!output}>
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={generate}
              disabled={status === "loading" || !output}
            >
              Regenerate
            </Button>
          </div>
        </div>

        <Textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder={
            status === "loading"
              ? "Writing…"
              : "Your editable result appears here. Fill in the prompt and press Generate."
          }
          className="min-h-[22rem] flex-1 resize-y rounded-xl bg-card/70 text-sm leading-relaxed"
        />

        <div className="mt-3 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-notice" />
          <p className="text-[11px] leading-snug text-muted-foreground">
            AI-generated and fully editable. Check facts and tone before you use it.
          </p>
        </div>
      </section>
    </div>
  );
}

export function ToolHeader({ tool }: { tool: ToolConfig }) {
  return (
    <header className="animate-rise">
      <div className="label-micro">Tools / {tool.tag}</div>
      <h1 className="text-2xl font-extrabold tracking-tight">{tool.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
    </header>
  );
}
