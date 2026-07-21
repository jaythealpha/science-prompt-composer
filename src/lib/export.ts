import type { GenerationResult, GenerationSettings } from "./types";

interface ExportPayload {
  input: string;
  settings: GenerationSettings;
  result: GenerationResult;
}

export function buildPlainText({ input, settings, result }: ExportPayload): string {
  return [
    `SCIENCE PROMPT COMPOSER`,
    `========================`,
    ``,
    `INPUT: ${input}`,
    ``,
    `SETTINGS`,
    `- Category: ${settings.category}`,
    `- Style: ${settings.style}`,
    `- Aspect ratio: ${settings.aspectRatio}`,
    `- Complexity: ${settings.complexity}`,
    `- Label density: ${settings.labelDensity}`,
    `- Language: ${settings.language}`,
    ``,
    `DETECTED CATEGORY: ${result.detectedCategory}`,
    ``,
    `OVERVIEW`,
    result.overview,
    ``,
    `CAUSE: ${result.cause}`,
    `MECHANISM: ${result.mechanism}`,
    `RESULT: ${result.result}`,
    ``,
    `EXPLANATION`,
    result.explanationParagraph,
    ``,
    `LABELS`,
    ...result.labels.map((l) => `- ${l}`),
    ``,
    `FINAL PROMPT`,
    result.finalPrompt,
    ``,
    `NEGATIVE PROMPT`,
    result.negativePrompt,
    ``,
    `SIMPLIFIED PROMPT`,
    result.simplifiedPrompt,
  ].join("\n");
}

export function buildMarkdown({ input, settings, result }: ExportPayload): string {
  return [
    `# Science Prompt Composer`,
    ``,
    `**Input:** ${input}`,
    ``,
    `## Settings`,
    ``,
    `| Setting | Value |`,
    `| --- | --- |`,
    `| Category | ${settings.category} |`,
    `| Style | ${settings.style} |`,
    `| Aspect ratio | ${settings.aspectRatio} |`,
    `| Complexity | ${settings.complexity} |`,
    `| Label density | ${settings.labelDensity} |`,
    `| Language | ${settings.language} |`,
    ``,
    `**Detected category:** ${result.detectedCategory}`,
    ``,
    `## Overview`,
    ``,
    result.overview,
    ``,
    `- **Cause:** ${result.cause}`,
    `- **Mechanism:** ${result.mechanism}`,
    `- **Result:** ${result.result}`,
    ``,
    `## Explanation`,
    ``,
    result.explanationParagraph,
    ``,
    `## Labels`,
    ``,
    ...result.labels.map((l) => `- ${l}`),
    ``,
    `## Final prompt`,
    ``,
    "```text",
    result.finalPrompt,
    "```",
    ``,
    `## Negative prompt`,
    ``,
    "```text",
    result.negativePrompt,
    "```",
    ``,
    `## Simplified prompt`,
    ``,
    "```text",
    result.simplifiedPrompt,
    "```",
  ].join("\n");
}

export function buildJson({ input, settings, result }: ExportPayload): string {
  return JSON.stringify(
    {
      input,
      settings,
      detectedCategory: result.detectedCategory,
      explanation: result.explanationParagraph,
      labels: result.labels,
      finalPrompt: result.finalPrompt,
      negativePrompt: result.negativePrompt,
      simplifiedPrompt: result.simplifiedPrompt,
      infographicPrompt: result.infographicPrompt,
    },
    null,
    2,
  );
}

export function downloadFile(filename: string, content: string, mime: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function slugifyForFile(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "science-prompt";
}
