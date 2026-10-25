import type { Metadata } from "next";
import { StreamGrid } from "@/components/stream-grid";

export const metadata: Metadata = {
  title: "شبكة البث | مشغلات متعددة في صفحة واحدة",
  description: "عرض عدة قنوات بث في شبكة، تكبير القناة المختارة والعودة للوضع السابق، مع عرض القنوات التي تعمل فقط وإمكانية إضافة قنوات من الإدارة",
};

export default function HomePage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <header className="border-border-subtle bg-surface/80 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container-page flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="from-brand-600 to-accent-500 grid size-8 place-items-center rounded-lg bg-gradient-to-br text-sm font-bold text-white">
              بث
            </span>
            <h1 className="text-base font-bold sm:text-lg">شبكة البث</h1>
          </div>
          <p className="text-muted hidden text-xs sm:block">انقر على قناة لتكبيرها، وانقر مجدداً للعودة للشبكة</p>
        </div>
      </header>

      <section className="container-page py-4 sm:py-6">
        <StreamGrid />
      </section>
    </main>
  );
}
