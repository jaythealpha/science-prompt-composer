import type { Metadata } from "next";
import { ExamplesGallery } from "@/components/examples-gallery";

export const metadata: Metadata = {
  title: "Examples",
  description:
    "Browse ready-made scientific phenomena — aurora, fission, lightning, tectonics, and more — and open any of them in the generator.",
};

export default function ExamplesPage() {
  return (
    <main id="main-content" className="aurora-field min-h-dvh">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <ExamplesGallery />
      </div>
    </main>
  );
}
