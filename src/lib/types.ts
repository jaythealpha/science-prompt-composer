export type Language = "en" | "ko" | "ja";

export interface LangText {
  en: string;
  ko: string;
  ja: string;
}

export type ScienceCategory =
  | "physics"
  | "chemistry"
  | "biology"
  | "earth"
  | "space";

export type CategorySetting = "auto" | ScienceCategory;

export type VisualScale =
  | "cosmic"
  | "planetary"
  | "landscape"
  | "human"
  | "microscopic"
  | "molecular"
  | "atomic"
  | "subatomic";

export type VisualStyle =
  | "infographic"
  | "cinematic"
  | "photorealistic"
  | "textbook"
  | "futuristic";

export type AspectRatio = "16:9" | "4:5" | "1:1" | "9:16";

export type Complexity = "general" | "student" | "advanced";

export type LabelDensity = "minimal" | "standard" | "detailed";

export interface PhenomenonProfile {
  id: string;
  slug: string;
  title: LangText;
  aliases: string[];
  category: ScienceCategory;
  scale: VisualScale;
  shortExplanation: LangText;
  cause: LangText;
  mechanism: LangText;
  result: LangText;
  visualElements: LangText[];
  labelSuggestions: LangText[];
  annotations: LangText[];
  styleNotes: LangText;
  cautions: LangText;
  negativeTerms: string[];
  exampleInput: LangText;
}

export interface GenerationSettings {
  category: CategorySetting;
  style: VisualStyle;
  aspectRatio: AspectRatio;
  complexity: Complexity;
  labelDensity: LabelDensity;
  language: Language;
  includeLabels: boolean;
  includeExplanation: boolean;
  includeNegativePrompt: boolean;
  includeSimplifiedPrompt: boolean;
  includeInfographicPrompt: boolean;
}

export interface GenerationResult {
  title: string;
  detectedCategory: ScienceCategory;
  matchedSlug: string | null;
  matchConfidence: "profile" | "fallback";
  overview: string;
  cause: string;
  mechanism: string;
  result: string;
  visualizationStrategy: string;
  visualElements: string[];
  labels: string[];
  annotations: string[];
  explanationParagraph: string;
  finalPrompt: string;
  negativePrompt: string;
  simplifiedPrompt: string;
  infographicPrompt: string;
  cautions: string;
}

export interface GenerationRequest {
  input: string;
  settings: GenerationSettings;
}

export interface GenerationService {
  generate(request: GenerationRequest): Promise<GenerationResult>;
}

export interface HistoryEntry {
  id: string;
  createdAt: number;
  input: string;
  settings: GenerationSettings;
  result: GenerationResult;
  favorite: boolean;
}

export const DEFAULT_SETTINGS: GenerationSettings = {
  category: "auto",
  style: "infographic",
  aspectRatio: "16:9",
  complexity: "general",
  labelDensity: "standard",
  language: "en",
  includeLabels: true,
  includeExplanation: true,
  includeNegativePrompt: true,
  includeSimplifiedPrompt: true,
  includeInfographicPrompt: true,
};
