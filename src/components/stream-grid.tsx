"use client";

import { useEffect, useMemo, useState } from "react";
import { streams as defaultStreams, type StreamItem } from "@/data/streams";

type AdminStream = StreamItem & { active?: boolean };

function proxyUrl(url: string): string {
  return url;
}

function loadAdminStreams(): StreamItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("admin-streams");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AdminStream[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s) => s && s.url && s.title)
      .map((s) => ({
        id: s.id || `admin-${s.url}`,
        title: s.title,
        time: s.time,
        url: s.url,
        group: s.group || "admin",
        active: s.active !== false,
      }))
      .filter((s) => (s as AdminStream).active !== false);
  } catch {
    return [];
  }
}

export function StreamGrid() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [adminStreams, setAdminStreams] = useState<StreamItem[]>(() => loadAdminStreams());

  useEffect(() => {
    const onUpdate = () => setAdminStreams(loadAdminStreams());
    window.addEventListener("storage", onUpdate);
    window.addEventListener("admin-streams-updated", onUpdate as EventListener);
    return () => {
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("admin-streams-updated", onUpdate as EventListener);
    };
  }, []);

  const allStreams = useMemo(() => {
    const combined = [...defaultStreams, ...adminStreams];
    const map = new Map<string, StreamItem>();
    for (const s of combined) {
      if (!map.has(s.url)) map.set(s.url, s);
    }
    return Array.from(map.values());
  }, [adminStreams]);

  const filtered = useMemo(() => {
    if (filter === "all") return allStreams;
    return allStreams.filter((s) => s.group === filter);
  }, [allStreams, filter]);

  const allGroups = useMemo(() => {
    const set = new Set<string>();
    for (const s of allStreams) {
      if (s.group) set.add(s.group);
    }
    return Array.from(set);
  }, [allStreams]);

  function toggle(id: string) {
    setSelected((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-brand-600 text-white"
              : "border-border-subtle bg-surface-raised text-muted hover:text-foreground border"
          }`}
        >
          الكل
        </button>
        {allGroups.map((g) => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === g
                ? "bg-brand-600 text-white"
                : "border-border-subtle bg-surface-raised text-muted hover:text-foreground border"
            }`}
          >
            {g}
          </button>
        ))}
        <a
          href="/admin"
          className="border-border-subtle bg-surface-raised text-muted hover:text-foreground mr-auto rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
        >
          لوحة الإدارة
        </a>
      </div>

      <div
        className={`grid gap-2 transition-all ${
          selected
            ? "grid-cols-1"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        }`}
      >
        {filtered.map((item) => {
          const isSelected = selected === item.id;
          return (
            <article
              key={item.id}
              className={`border-border-subtle bg-surface-raised overflow-hidden rounded-xl border shadow-sm transition-all ${
                isSelected ? "col-span-full" : ""
              }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-right"
                aria-expanded={isSelected}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">{item.title}</p>
                  <p className="text-muted text-xs">
                    {item.time ? `${item.time} • ` : ""}
                    {item.group}
                  </p>
                </div>
                <span className="text-muted text-xs">{isSelected ? "تصغير" : "تكبير"}</span>
              </button>
              {isSelected && (
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={proxyUrl(item.url)}
                    className="absolute inset-0 h-full w-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur transition-colors hover:bg-black/90"
                    >
                      فتح في تبويب جديد
                    </a>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-muted py-10 text-center text-sm">لا توجد قنوات لعرضها</p>
      )}
    </div>
  );
}
