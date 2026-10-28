"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { koraChannels, type StreamItem } from "@/data/kora-channels";

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

export function KoraChannels() {
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(100);

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

  const allStreams: StreamItem[] = koraChannels;

  const filtered = useMemo(() => {
    if (!query.trim()) return allStreams;
    const q = query.trim().toLowerCase();
    return allStreams.filter((s) => s.title.toLowerCase().includes(q));
  }, [allStreams, query]);

  function toggle(id: string) {
    setSelected((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-4">
      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4 shadow-sm">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisibleCount(100);
          }}
          placeholder="بحث عن قناة..."
          className="border-border-subtle bg-surface text-foreground placeholder:text-muted min-w-[12rem] flex-1 rounded-xl border px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
        />
        <p className="text-muted text-xs">قنوات من 1 إلى 100</p>
        <Link
          href="/"
          className="border-border-subtle bg-surface-raised text-muted hover:text-foreground mr-auto rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
        >
          العودة للشبكة
        </Link>
      </div>

      <div
        className={`grid gap-3 transition-all ${
          selected ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
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
                    {item.group}
                    {" • "}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:underline"
                    >
                      فتح الرابط
                    </a>
                  </p>
                </div>
                <span className="text-muted text-xs">{isSelected ? "تصغير" : "تكبير"}</span>
              </button>
              <LazyFrame url={item.url} auto={isSelected} />
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
            onClick={() => setVisibleCount((c) => c + 24)}
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
