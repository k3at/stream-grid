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

function LazyFrame({ url, auto = false }: { url: string; auto?: boolean }) {
  const [clicked, setClicked] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const visible = auto || clicked;

  if (!visible) {
    return (
      <div className="bg-surface-raised relative grid aspect-video w-full place-items-center">
        <button
          onClick={() => setClicked(true)}
          className="from-brand-600 to-accent-500 rounded-xl bg-gradient-to-l px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
        >
          ▶ تشغيل
        </button>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-black">
      <iframe
        key={retryKey}
        src={url}
        className="absolute inset-0 h-full w-full"
        loading="lazy"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="no-referrer"
      />
      <button
        onClick={() => setRetryKey((k) => k + 1)}
        className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-2 py-1 text-xs text-white backdrop-blur transition-colors hover:bg-black/90"
        title="إعادة المحاولة"
      >
        ↻
      </button>
    </div>
  );
}

function parseMinutes(t?: string): number | null {
  if (!t) return null;
  const m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

function statusOf(time: string | undefined, offset: number): "live" | "upcoming" | "finished" | "unknown" {
  const mm = parseMinutes(time);
  if (mm === null) return "unknown";
  const d = new Date();
  const utcMin = d.getUTCHours() * 60 + d.getUTCMinutes();
  const nowMin = utcMin + offset * 60;
  if (nowMin < mm) return "upcoming";
  if (nowMin < mm + 120) return "live";
  return "finished";
}

export function StreamGrid() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const [liveOnly, setLiveOnly] = useState<boolean>(false);
  const [tzOffset, setTzOffset] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const v = localStorage.getItem("tz-offset");
    return v ? Number(v) : 0;
  });
  const [tick, setTick] = useState<number>(0);
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [adminStreams, setAdminStreams] = useState<StreamItem[]>(() => loadAdminStreams());

  useEffect(() => {
    const onUpdate = () => setAdminStreams(loadAdminStreams());
    window.addEventListener("storage", onUpdate);
    window.addEventListener("admin-streams-updated", onUpdate as EventListener);
    const timer = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => {
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("admin-streams-updated", onUpdate as EventListener);
      clearInterval(timer);
    };
  }, []);

  // reset handled in change handlers

  // sync selected with URL hash
  useEffect(() => {
    if (typeof window === "undefined") return;
    const applyHash = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (h) setSelected(h);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selected) window.location.hash = selected;
    else if (window.location.hash) window.location.hash = "";
  }, [selected]);

  const allStreams = useMemo(() => {
    const combined = [...defaultStreams, ...adminStreams];
    const map = new Map<string, StreamItem>();
    for (const s of combined) {
      if (!map.has(s.url)) map.set(s.url, s);
    }
    return Array.from(map.values());
  }, [adminStreams]);

  const filtered = useMemo(() => {
    let list = filter === "all" ? allStreams : allStreams.filter((s) => s.group === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((s) => s.title.toLowerCase().includes(q));
    }
    if (liveOnly) {
      list = list.filter((s) => statusOf(s.time, tzOffset) === "live");
    }
    return list;
  }, [allStreams, filter, query, liveOnly, tzOffset, tick]);

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
      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4 shadow-sm">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setVisibleCount(12); }}
          placeholder="بحث عن مباراة..."
          className="border-border-subtle bg-surface text-foreground placeholder:text-muted min-w-[12rem] flex-1 rounded-xl border px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
        />
        <select
          value={tzOffset}
          onChange={(e) => {
            const v = Number(e.target.value);
            setTzOffset(v);
            if (typeof window !== "undefined") localStorage.setItem("tz-offset", String(v));
            setVisibleCount(12);
          }}
          className="border-border-subtle bg-surface-raised text-foreground rounded-lg border px-2 py-1.5 text-sm"
          title="المنطقة الزمنية (UTC offset)"
        >
          {Array.from({ length: 29 }, (_, i) => i - 12).map((h) => (
            <option key={h} value={h}>
              UTC{h >= 0 ? "+" : ""}
              {h}
            </option>
          ))}
        </select>
        <button
          onClick={() => { setLiveOnly((v) => !v); setVisibleCount(12); }}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            liveOnly
              ? "bg-red-600 text-white"
              : "border-border-subtle bg-surface-raised text-muted hover:text-foreground border"
          }`}
        >
          🔴 مباشر
        </button>
        <button
          onClick={() => { setFilter("all"); setVisibleCount(12); }}
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
            onClick={() => { setFilter(g); setVisibleCount(12); }}
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
        className={`grid gap-3 transition-all ${
          selected
            ? "grid-cols-1"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        }`}
      >
        {filtered.slice(0, visibleCount).map((item) => {
          const isSelected = selected === item.id;
          return (
            <article
              key={item.id}
              className={`border-border-subtle bg-surface-raised card-hover overflow-hidden rounded-2xl border shadow-sm transition-all ${
                isSelected ? "col-span-full ring-2 ring-brand-400" : ""
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
                    {" • "}
                    {statusOf(item.time, tzOffset) === "live"
                      ? "🔴 مباشر"
                      : statusOf(item.time, tzOffset) === "upcoming"
                      ? "⏳ قادم"
                      : statusOf(item.time, tzOffset) === "finished"
                      ? "✓ انتهى"
                      : ""}
                  </p>
                </div>
                <span className="text-muted text-xs">{isSelected ? "تصغير" : "تكبير"}</span>
              </button>
              <LazyFrame url={proxyUrl(item.url)} auto={isSelected} />
              {isSelected && (
                <div className="flex justify-center px-3 py-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur transition-colors hover:bg-black/90"
                  >
                    فتح في تبويب جديد
                  </a>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {visibleCount < filtered.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + 12)}
            className="border-border-subtle bg-surface-raised text-muted hover:text-foreground rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            تحميل المزيد ({filtered.length - visibleCount})
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-muted py-10 text-center text-sm">لا توجد قنوات لعرضها</p>
      )}
    </div>
  );
}
