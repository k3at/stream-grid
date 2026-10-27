"use client";

import { useState } from "react";
import Link from "next/link";
import type { StreamItem } from "@/data/streams";

type AdminItem = StreamItem & { active: boolean };

function load(): AdminItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("admin-streams");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AdminItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(items: AdminItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("admin-streams", JSON.stringify(items));
  window.dispatchEvent(new Event("admin-streams-updated"));
}

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin123";
const ADMIN_PASSWORD_HASH = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH ?? "";

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("admin-authed") === "1";
  });
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [items, setItems] = useState<AdminItem[]>(() => (authed ? load() : []));
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [time, setTime] = useState("");
  const [group, setGroup] = useState("admin");

  async function login() {
    let ok = false;
    if (ADMIN_PASSWORD_HASH) {
      ok = (await sha256Hex(password)) === ADMIN_PASSWORD_HASH.toLowerCase();
    } else {
      ok = password === ADMIN_PASSWORD;
    }
    if (ok) {
      sessionStorage.setItem("admin-authed", "1");
      setAuthed(true);
      setItems(load());
      setAuthError("");
    } else {
      setAuthError("كلمة المرور غير صحيحة");
    }
  }

  function logout() {
    sessionStorage.removeItem("admin-authed");
    setAuthed(false);
    setItems([]);
  }

  if (!authed) {
    return (
      <main className="bg-surface text-foreground flex min-h-screen items-center justify-center">
        <div className="border-border-subtle bg-surface-raised w-full max-w-sm rounded-xl border p-6 shadow-sm">
          <h1 className="text-foreground text-lg font-bold">لوحة الإدارة</h1>
          <p className="text-muted mt-1 text-sm">أدخل كلمة المرور للمتابعة</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
            placeholder="كلمة المرور"
            className="border-border-subtle bg-surface text-foreground placeholder:text-muted mt-4 w-full rounded-lg border px-3 py-2 text-sm"
          />
          {authError && <p className="mt-2 text-xs text-red-500">{authError}</p>}
          <button
            onClick={login}
            className="bg-brand-600 mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            دخول
          </button>
          <Link href="/" className="text-muted mt-3 block text-center text-xs hover:underline">
            العودة للشبكة
          </Link>
        </div>
      </main>
    );
  }

  function add() {
    if (!title.trim() || !url.trim()) return;
    const newItem: AdminItem = {
      id: `admin-${slug(title)}-${Date.now()}`,
      title: title.trim(),
      url: url.trim(),
      time: time.trim() || undefined,
      group: group.trim() || "admin",
      active: true,
    };
    const next = [newItem, ...items];
    setItems(next);
    save(next);
    setTitle("");
    setUrl("");
    setTime("");
  }

  function toggle(i: number) {
    const next = items.map((it, idx) => (idx === i ? { ...it, active: !it.active } : it));
    setItems(next);
    save(next);
  }

  function remove(i: number) {
    const next = items.filter((_, idx) => idx !== i);
    setItems(next);
    save(next);
  }

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <header className="border-border-subtle bg-surface/80 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container-page flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-muted hover:text-foreground text-sm">
              ← العودة للشبكة
            </Link>
            <h1 className="text-base font-bold sm:text-lg">لوحة الإدارة</h1>
            <button
              onClick={logout}
              className="border-border-subtle text-muted hover:text-foreground mr-auto rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <section className="container-page space-y-6 py-6">
        <div className="border-border-subtle bg-surface-raised rounded-xl border p-4 shadow-sm">
          <h2 className="text-foreground text-sm font-bold">إضافة رابط بث جديد</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اسم القناة / المباراة"
              className="border-border-subtle bg-surface text-foreground placeholder:text-muted rounded-lg border px-3 py-2 text-sm"
            />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="رابط البث (https://...)"
              className="border-border-subtle bg-surface text-foreground placeholder:text-muted rounded-lg border px-3 py-2 text-sm"
            />
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="الوقت (اختياري) مثل 20:00"
              className="border-border-subtle bg-surface text-foreground placeholder:text-muted rounded-lg border px-3 py-2 text-sm"
            />
            <input
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="المجموعة (اختياري)"
              className="border-border-subtle bg-surface text-foreground placeholder:text-muted rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={add}
            className="bg-brand-600 mt-3 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            إضافة
          </button>
        </div>

        <div className="border-border-subtle bg-surface-raised overflow-hidden rounded-xl border shadow-sm">
          <div className="border-border-subtle border-b px-4 py-2">
            <h2 className="text-foreground text-sm font-bold">القنوات المضافة</h2>
          </div>
          <div className="divide-border-subtle divide-y">
            {items.length === 0 && (
              <p className="text-muted px-4 py-6 text-center text-sm">لا توجد قنوات مضافة بعد</p>
            )}
            {items.map((it, i) => (
              <div key={it.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">{it.title}</p>
                  <p className="text-muted truncate text-xs">
                    {it.time ? `${it.time} • ` : ""}
                    {it.group} • {it.url}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggle(i)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      it.active
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "border-border-subtle text-muted border hover:text-foreground"
                    }`}
                  >
                    {it.active ? "مفعّل" : "معطّل"}
                  </button>
                  <button
                    onClick={() => remove(i)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-muted text-xs">
          يتم حفظ القنوات المضافة في localStorage لهذا المتصفح فقط.
        </p>
      </section>
    </main>
  );
}
