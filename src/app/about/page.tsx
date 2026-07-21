import type { Metadata } from "next";
import { AboutContent } from "@/components/about-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "What Science Prompt Composer does, how the workflow works, supported science categories, and the limitations of AI-generated scientific imagery.",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="aurora-field min-h-dvh">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6">
        <AboutContent />
      </div>
    </main>
  );
}
