import { Suspense } from "react";
import { Generator } from "@/components/generator/generator";
import { Hero } from "@/components/hero";

export default function HomePage() {
  return (
    <main id="main-content" className="aurora-field min-h-dvh">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6">
        <Hero />
        <Suspense fallback={null}>
          <Generator />
        </Suspense>
      </div>
    </main>
  );
}
