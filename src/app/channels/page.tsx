import type { Metadata } from "next";
import Link from "next/link";
import { KoraChannels } from "@/components/kora-channels";

export const metadata: Metadata = {
  title: "قنوات البث | 1 - 100",
  description: "عرض 100 قناة بث من s3.kora.st مع إمكانية التكبير والتصغير",
};

export default function ChannelsPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-40 right-0 size-[40rem] rounded-full bg-gradient-to-br from-brand-400/30 to-accent-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 size-[30rem] rounded-full bg-gradient-to-tr from-brand-600/20 to-transparent blur-3xl" />
      </div>
      <header className="border-border-subtle bg-surface/70 sticky top-0 z-50 border-b backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="from-brand-600 to-accent-500 grid size-10 place-items-center rounded-xl bg-gradient-to-br text-base font-bold text-white shadow-lg">
              بث
            </span>
            <div>
              <h1 className="text-base font-extrabold sm:text-lg">قنوات البث</h1>
              <p className="text-muted text-[10px] sm:text-xs">قنوات 1 - 100 • بث مباشر</p>
            </div>
          </div>
          <Link
            href="/"
            className="border-border-subtle bg-surface-raised text-muted hover:text-foreground rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
          >
            شبكة البث
          </Link>
        </div>
      </header>
      <section className="container-page py-6 sm:py-8">
        <KoraChannels />
      </section>
    </main>
  );
}
