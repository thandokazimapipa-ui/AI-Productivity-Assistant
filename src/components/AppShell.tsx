import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DISCLAIMER, NAV_ITEMS } from "@/lib/tools";
import { cn } from "@/lib/utils";

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const groups = ["Overview", "Tools"];

  return (
    <nav className="flex flex-col gap-1">
      {groups.map((group) => (
        <div key={group} className="flex flex-col gap-1">
          <div className="label-micro px-3 pt-3 pb-1">{group}</div>
          {NAV_ITEMS.filter((item) => item.group === group).map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                    : "text-foreground/80 hover:bg-card/70"
                )}
              >
                <span
                  className={cn(
                    "grid size-4 place-items-center text-[11px] transition-colors",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                  )}
                  aria-hidden
                >
                  {item.glyph}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-2">
      <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 ring-1 ring-white/40">
        <span className="text-sm font-bold text-primary-foreground">H</span>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold tracking-tight">Halo</div>
        <div className="label-micro">Workplace AI</div>
      </div>
    </Link>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-5 px-5 py-6">
      <Brand />
      <div className="flex items-center gap-2 rounded-xl bg-card/60 px-3 py-2 ring-1 ring-border">
        <span className="size-1.5 rounded-full bg-chart-5" />
        <span className="font-mono text-xs text-muted-foreground">5 tools ready</span>
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto rounded-xl bg-card/60 p-3 ring-1 ring-border">
        <p className="label-micro mb-1.5">Responsible AI</p>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Outputs are drafts. Review before you send, share or act.
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute -top-32 -left-24 size-[480px] rounded-full bg-primary/20 blur-[90px]" />
        <div className="absolute top-1/3 right-0 size-[420px] rounded-full bg-primary/15 blur-[90px]" />
        <div className="absolute bottom-0 left-1/3 size-[380px] rounded-full bg-primary/10 blur-[90px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="panel sticky top-0 hidden h-screen w-64 shrink-0 md:block">
          <SidebarInner />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="panel sticky top-0 z-20 flex items-center justify-between px-4 py-3 md:hidden">
            <Brand />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                aria-label="Open navigation"
                className="grid size-9 place-items-center rounded-lg ring-1 ring-border"
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-background p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarInner onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>

          <main className="min-w-0 flex-1 space-y-6 px-4 py-6 md:px-8">{children}</main>

          <footer className="px-4 pb-6 md:px-8">
            <div className="panel flex items-start gap-3 rounded-2xl px-4 py-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-notice/15 text-[12px] text-notice">
                i
              </span>
              <p className="text-[11px] leading-snug text-muted-foreground">{DISCLAIMER}</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
