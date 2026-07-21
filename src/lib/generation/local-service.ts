import { PHENOMENA } from "../phenomena";
import type {
  GenerationRequest,
  GenerationResult,
  GenerationService,
  Language,
  LabelDensity,
  LangText,
  PhenomenonProfile,
  ScienceCategory,
  VisualScale,
} from "../types";
import {
  CATEGORY_KEYWORDS,
  SCALE_KEYWORDS,
  SCALE_LABEL,
  STYLE_DIRECTIVE,
  STYLE_LABEL,
} from "./dictionary";

function pick(text: LangText, lang: Language): string {
  return text[lang];
}

function normalize(input: string): string {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

function scoreProfile(normalized: string, profile: PhenomenonProfile): number {
  let score = 0;
  for (const alias of profile.aliases) {
    const a = alias.toLowerCase();
    if (!a) continue;
    if (normalized.includes(a)) {
      // Longer aliases are more specific and score higher.
      score += a.length >= 5 ? 6 : 3;
    }
  }
  // Reward overlap with the profile's own titles.
  for (const title of [profile.title.en, profile.title.ko, profile.title.ja]) {
    const t = title.toLowerCase();
    if (t && normalized.includes(t)) score += 4;
  }
  return score;
}

function matchProfile(normalized: string): PhenomenonProfile | null {
  let best: PhenomenonProfile | null = null;
  let bestScore = 0;
  for (const profile of PHENOMENA) {
    const score = scoreProfile(normalized, profile);
    if (score > bestScore) {
      bestScore = score;
      best = profile;
    }
  }
  return bestScore > 0 ? best : null;
}

function detectCategory(normalized: string): ScienceCategory {
  let best: ScienceCategory = "physics";
  let bestScore = 0;
  (Object.keys(CATEGORY_KEYWORDS) as ScienceCategory[]).forEach((category) => {
    let score = 0;
    for (const keyword of CATEGORY_KEYWORDS[category]) {
      if (normalized.includes(keyword.toLowerCase())) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  });
  return best;
}

function detectScale(normalized: string): VisualScale {
  let best: VisualScale = "human";
  let bestScore = 0;
  (Object.keys(SCALE_KEYWORDS) as VisualScale[]).forEach((scale) => {
    let score = 0;
    for (const keyword of SCALE_KEYWORDS[scale]) {
      if (normalized.includes(keyword.toLowerCase())) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = scale;
    }
  });
  return best;
}

function cleanTopicTitle(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, " ").replace(/[?.!？。！]+$/, "");
  const stripped = trimmed
    .replace(/^(explain|visualize|show|describe|illustrate)\s+(how|the|a|an)?\s*/i, "")
    .replace(/^(how\s+(does|do|is|are)|what\s+(is|are)|why\s+(does|do|is|are))\s+/i, "")
    .replace(/\s+(forms?|works?|happens?|occurs?|forming|working)$/i, "")
    .trim();
  const base = stripped.length > 0 ? stripped : trimmed;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function densityCount(density: LabelDensity): number {
  switch (density) {
    case "minimal":
      return 3;
    case "standard":
      return 5;
    case "detailed":
      return 8;
  }
}

function complexityTone(lang: Language, complexity: GenerationRequest["settings"]["complexity"]): string {
  if (lang === "ko") {
    switch (complexity) {
      case "general":
        return "일반 대중이 이해할 수 있도록 쉬운 용어로";
      case "student":
        return "학생 수준의 정확한 용어를 사용해";
      case "advanced":
        return "전문적이고 기술적으로 정밀한 용어로";
    }
  }
  if (lang === "ja") {
    switch (complexity) {
      case "general":
        return "一般の人にも分かりやすい平易な言葉で";
      case "student":
        return "学生レベルの正確な用語を用いて";
      case "advanced":
        return "専門的で技術的に精密な用語で";
    }
  }
  switch (complexity) {
    case "general":
      return "in accessible language for a general audience";
    case "student":
      return "with accurate student-level terminology";
    case "advanced":
      return "with precise, technically advanced terminology";
  }
}

function buildFallbackProfile(input: string, category: ScienceCategory, scale: VisualScale): PhenomenonProfile {
  const topic = cleanTopicTitle(input);
  const t = (en: string, ko: string, ja: string): LangText => ({ en, ko, ja });
  return {
    id: "generic-fallback",
    slug: "generic-fallback",
    title: t(topic, topic, topic),
    aliases: [],
    category,
    scale,
    shortExplanation: t(
      `${topic} is a scientific phenomenon involving a clear cause, an underlying mechanism, and an observable result.`,
      `${topic}은(는) 명확한 원인, 근본 메커니즘, 관찰 가능한 결과를 가진 과학 현상입니다.`,
      `${topic}は、明確な原因、根底にあるメカニズム、観察可能な結果を持つ科学現象です。`,
    ),
    cause: t(
      `An initiating condition or input sets ${topic} in motion.`,
      `어떤 시작 조건이나 입력이 ${topic}을(를) 일으킵니다.`,
      `ある初期条件や入力が${topic}を引き起こします。`,
    ),
    mechanism: t(
      `Energy, matter, or forces interact through a step-by-step process that drives ${topic}.`,
      `에너지, 물질, 힘이 단계적 과정을 통해 상호작용하며 ${topic}을(를) 이끕니다.`,
      `エネルギー・物質・力が段階的な過程で相互作用し、${topic}を進行させます。`,
    ),
    result: t(
      `The process produces a measurable, observable outcome that defines ${topic}.`,
      `이 과정은 ${topic}을(를) 규정하는 측정 가능하고 관찰 가능한 결과를 만듭니다.`,
      `この過程は${topic}を特徴づける、測定・観察可能な結果を生み出します。`,
    ),
    visualElements: [
      t("Central subject of the phenomenon", "현상의 중심 대상", "現象の中心となる対象"),
      t("Directional arrows showing energy or matter flow", "에너지·물질 흐름을 나타내는 방향 화살표", "エネルギーや物質の流れを示す方向矢印"),
      t("Before and after states of the process", "과정의 전후 상태", "過程の前後の状態"),
      t("Key interacting components", "핵심 상호작용 요소", "相互作用する主要な要素"),
    ],
    labelSuggestions: [
      t("Cause / trigger", "원인 / 유발 요인", "原因・きっかけ"),
      t("Core mechanism", "핵심 메커니즘", "中心メカニズム"),
      t("Energy or matter flow", "에너지 또는 물질 흐름", "エネルギーまたは物質の流れ"),
      t("Observable result", "관찰 가능한 결과", "観察可能な結果"),
    ],
    annotations: [
      t("An input initiates the process", "입력이 과정을 시작", "入力が過程を開始する"),
      t("Components interact step by step", "요소들이 단계적으로 상호작용", "要素が段階的に相互作用する"),
      t("A measurable result emerges", "측정 가능한 결과가 나타남", "測定可能な結果が現れる"),
    ],
    styleNotes: t(
      "Balanced, neutral scientific illustration with clear labeling and logical left-to-right flow.",
      "명확한 라벨과 논리적인 좌우 흐름을 갖춘 균형 잡힌 중립적 과학 일러스트.",
      "明確なラベルと左から右への論理的な流れを備えた、バランスの取れた中立的な科学イラスト。",
    ),
    cautions: t(
      "This is a generic template. Verify the specific scientific details for your phenomenon before publishing.",
      "이것은 일반 템플릿입니다. 배포 전 해당 현상의 구체적 과학 정보를 반드시 확인하세요.",
      "これは汎用テンプレートです。公開前に対象現象の具体的な科学情報を必ず確認してください。",
    ),
    negativeTerms: ["scientifically inaccurate", "misleading labels", "unrelated objects"],
    exampleInput: t(input, input, input),
  };
}

function buildVisualizationStrategy(
  profile: PhenomenonProfile,
  lang: Language,
  scale: VisualScale,
  styleDirective: string,
): string {
  const scaleLabel = pick(SCALE_LABEL[scale], lang);
  if (lang === "ko") {
    return `${scaleLabel}에서 원인 → 메커니즘 → 결과의 흐름이 한눈에 읽히도록 구성합니다. ${styleDirective}을 적용하고, 핵심 요소를 시선의 흐름에 따라 배치해 과정의 인과 관계를 강조합니다.`;
  }
  if (lang === "ja") {
    return `${scaleLabel}で、原因 → メカニズム → 結果の流れが一目で読み取れるように構成します。${styleDirective}を適用し、主要な要素を視線の流れに沿って配置して因果関係を強調します。`;
  }
  return `Frame the scene at ${scaleLabel} so the cause → mechanism → result flow reads at a glance. Apply ${styleDirective}, arranging the key elements along the reading path to emphasize the causal sequence.`;
}

function bulletFor(lang: Language): string {
  if (lang === "ko") return "· ";
  if (lang === "ja") return "・";
  return "- ";
}

function joinList(items: string[], lang: Language): string {
  const bullet = bulletFor(lang);
  return items.map((item) => `${bullet}${item}`).join("\n");
}

function buildFinalPrompt(
  profile: PhenomenonProfile,
  request: GenerationRequest,
  scale: VisualScale,
  visualElements: string[],
  labels: string[],
  annotations: string[],
): string {
  const { settings } = request;
  const lang = settings.language;
  const title = pick(profile.title, lang);
  const styleDirective = pick(STYLE_DIRECTIVE[settings.style], lang);
  const styleName = pick(STYLE_LABEL[settings.style], lang);
  const scaleLabel = pick(SCALE_LABEL[scale], lang);
  const tone = complexityTone(lang, settings.complexity);

  const elementsBlock = joinList(visualElements, lang);
  const noLabels = lang === "ko" ? "라벨 없음" : lang === "ja" ? "ラベルなし" : "No labels";
  const labelsBlock = settings.includeLabels ? joinList(labels, lang) : noLabels;
  const annotationBlock = joinList(annotations, lang);

  if (lang === "ko") {
    return [
      `${title}을(를) 프리미엄 교육 다큐멘터리 스타일의 시네마틱 과학 인포그래픽으로 시각화하세요.`,
      "",
      "구성 (COMPOSITION):",
      `${scaleLabel}의 ${styleName} 화면. ${settings.aspectRatio} 화면비. 원인에서 결과로 이어지는 흐름이 명확히 읽히도록 배치.`,
      "",
      "과학적 과정 (SCIENTIFIC PROCESS):",
      `원인: ${pick(profile.cause, lang)}`,
      `메커니즘: ${pick(profile.mechanism, lang)}`,
      `결과: ${pick(profile.result, lang)}`,
      "",
      "시각 요소 (VISUAL ELEMENTS):",
      elementsBlock,
      "",
      "정보 라벨 (INFORMATION LABELS):",
      labelsBlock,
      "",
      "설명 텍스트 (EXPLANATORY TEXT):",
      annotationBlock,
      "",
      "레이아웃 (LAYOUT):",
      `핵심 대상을 중심에 두고 보조 요소와 지시선을 균형 있게 배치. ${tone} 표현. 여백과 정보 계층을 명확히.`,
      "",
      "스타일 (STYLE):",
      `${styleDirective}. ${pick(profile.styleNotes, lang)}`,
      "",
      "제약 (RESTRICTIONS):",
      `과학적으로 정확하게. 왜곡된 라벨, 무의미한 장식, 잘못된 물리 표현 배제. ${pick(profile.cautions, lang)}`,
    ].join("\n");
  }

  if (lang === "ja") {
    return [
      `${title}を、プレミアムな教育ドキュメンタリー調のシネマティックな科学インフォグラフィックとして視覚化してください。`,
      "",
      "構成 (COMPOSITION):",
      `${scaleLabel}の${styleName}シーン。アスペクト比${settings.aspectRatio}。原因から結果への流れが明確に読み取れるように配置。`,
      "",
      "科学的プロセス (SCIENTIFIC PROCESS):",
      `原因: ${pick(profile.cause, lang)}`,
      `メカニズム: ${pick(profile.mechanism, lang)}`,
      `結果: ${pick(profile.result, lang)}`,
      "",
      "視覚要素 (VISUAL ELEMENTS):",
      elementsBlock,
      "",
      "情報ラベル (INFORMATION LABELS):",
      labelsBlock,
      "",
      "説明テキスト (EXPLANATORY TEXT):",
      annotationBlock,
      "",
      "レイアウト (LAYOUT):",
      `中心となる対象を焦点に置き、補助要素と引き出し線をバランスよく配置。${tone}表現する。余白と情報階層を明確に保つ。`,
      "",
      "スタイル (STYLE):",
      `${styleDirective}。${pick(profile.styleNotes, lang)}`,
      "",
      "制約 (RESTRICTIONS):",
      `科学的に正確に保つ。歪んだラベル、意味のない装飾、誤った物理表現を避ける。${pick(profile.cautions, lang)}`,
    ].join("\n");
  }

  return [
    `Create a cinematic scientific infographic visualization of ${title}, presented in a premium educational documentary style.`,
    "",
    "COMPOSITION:",
    `A ${styleName} scene at ${scaleLabel}, ${settings.aspectRatio} aspect ratio, composed so the cause-to-result flow reads clearly.`,
    "",
    "SCIENTIFIC PROCESS:",
    `Cause: ${pick(profile.cause, lang)}`,
    `Mechanism: ${pick(profile.mechanism, lang)}`,
    `Result: ${pick(profile.result, lang)}`,
    "",
    "VISUAL ELEMENTS:",
    elementsBlock,
    "",
    "INFORMATION LABELS:",
    labelsBlock,
    "",
    "EXPLANATORY TEXT:",
    annotationBlock,
    "",
    "LAYOUT:",
    `Place the central subject as the focal point with supporting elements and callout lines balanced around it. Present the content ${tone}. Maintain clear whitespace and information hierarchy.`,
    "",
    "STYLE:",
    `${styleDirective}. ${pick(profile.styleNotes, lang)}`,
    "",
    "RESTRICTIONS:",
    `Keep it scientifically accurate. Avoid distorted labels, meaningless decoration, and incorrect physics. ${pick(profile.cautions, lang)}`,
  ].join("\n");
}

function buildNegativePrompt(profile: PhenomenonProfile, lang: Language): string {
  let shared: string[];
  if (lang === "ko") {
    shared = [
      "저해상도", "흐릿함", "왜곡된 텍스트", "잘못된 철자", "과학적 오류",
      "무의미한 장식", "지나친 네온", "유치한 그래픽", "워터마크",
    ];
  } else if (lang === "ja") {
    shared = [
      "低解像度", "ぼやけ", "歪んだ文字", "スペルミス", "科学的な誤り",
      "意味のない装飾", "過度なネオン", "子供っぽいグラフィック", "透かし",
    ];
  } else {
    shared = [
      "low resolution", "blurry", "distorted text", "misspelled labels", "scientific inaccuracy",
      "meaningless decoration", "excessive neon", "childish graphics", "watermark",
    ];
  }
  return [...shared, ...profile.negativeTerms].join(", ");
}

function buildSimplifiedPrompt(
  profile: PhenomenonProfile,
  lang: Language,
  styleName: string,
  aspect: string,
): string {
  const title = pick(profile.title, lang);
  if (lang === "ko") {
    return `${title}의 핵심 과정을 보여주는 깔끔한 ${styleName} 다이어그램. 라벨은 최소한으로, ${aspect} 화면비. 과학적으로 정확하게.`;
  }
  if (lang === "ja") {
    return `${title}の中心的な過程を示すクリーンな${styleName}の図。ラベルは最小限に、アスペクト比${aspect}。科学的に正確に。`;
  }
  return `A clean ${styleName} diagram showing the core process of ${title}. Minimal labels, ${aspect} aspect ratio, scientifically accurate.`;
}

function buildInfographicPrompt(
  profile: PhenomenonProfile,
  lang: Language,
  labels: string[],
  aspect: string,
): string {
  const title = pick(profile.title, lang);
  const labelLine = labels.slice(0, 6).join(", ");
  if (lang === "ko") {
    return [
      `${title}에 대한 상세 과학 인포그래픽 포스터, ${aspect} 화면비.`,
      "제목 헤더, 번호가 매겨진 단계별 다이어그램, 지시선이 있는 라벨, 하단 요약 캡션을 포함.",
      `핵심 라벨: ${labelLine}.`,
      "정밀한 정렬, 명확한 정보 계층, 절제된 과학적 색상 팔레트. 텍스트는 선명하고 읽기 쉽게.",
    ].join("\n");
  }
  if (lang === "ja") {
    return [
      `${title}に関する詳細な科学インフォグラフィックポスター、アスペクト比${aspect}。`,
      "タイトルヘッダー、番号付きのステップ図、引き出し線付きのラベル、下部の要約キャプションを含める。",
      `主要なラベル: ${labelLine}。`,
      "精密な整列、明確な情報階層、抑えた科学的カラーパレット。テキストは鮮明で読みやすく。",
    ].join("\n");
  }
  return [
    `A detailed scientific infographic poster about ${title}, ${aspect} aspect ratio.`,
    "Include a title header, a numbered step-by-step diagram, labels with callout lines, and a summary caption at the bottom.",
    `Key labels: ${labelLine}.`,
    "Precise alignment, clear information hierarchy, and a restrained scientific color palette. Keep all text crisp and legible.",
  ].join("\n");
}

function buildExplanationParagraph(profile: PhenomenonProfile, lang: Language): string {
  return [
    pick(profile.shortExplanation, lang),
    pick(profile.cause, lang),
    pick(profile.mechanism, lang),
    pick(profile.result, lang),
  ].join(" ");
}

export class LocalGenerationService implements GenerationService {
  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const { input, settings } = request;
    const lang = settings.language;
    const normalized = normalize(input);

    const matched = normalized.length > 0 ? matchProfile(normalized) : null;

    const detectedCategory: ScienceCategory =
      settings.category !== "auto"
        ? settings.category
        : matched
          ? matched.category
          : detectCategory(normalized);

    const scale: VisualScale = matched ? matched.scale : detectScale(normalized);

    const profile = matched ?? buildFallbackProfile(input || "this phenomenon", detectedCategory, scale);

    const count = densityCount(settings.labelDensity);

    const visualElements = profile.visualElements.map((v) => pick(v, lang));
    const labels = profile.labelSuggestions.map((l) => pick(l, lang)).slice(0, count);
    const annotations = profile.annotations.map((a) => pick(a, lang));

    const styleDirective = pick(STYLE_DIRECTIVE[settings.style], lang);
    const styleName = pick(STYLE_LABEL[settings.style], lang);

    return {
      title: pick(profile.title, lang),
      detectedCategory,
      matchedSlug: matched ? matched.slug : null,
      matchConfidence: matched ? "profile" : "fallback",
      overview: pick(profile.shortExplanation, lang),
      cause: pick(profile.cause, lang),
      mechanism: pick(profile.mechanism, lang),
      result: pick(profile.result, lang),
      visualizationStrategy: buildVisualizationStrategy(profile, lang, scale, styleDirective),
      visualElements,
      labels,
      annotations,
      explanationParagraph: buildExplanationParagraph(profile, lang),
      finalPrompt: buildFinalPrompt(
        profile,
        request,
        scale,
        visualElements,
        labels,
        annotations,
      ),
      negativePrompt: buildNegativePrompt(profile, lang),
      simplifiedPrompt: buildSimplifiedPrompt(profile, lang, styleName, settings.aspectRatio),
      infographicPrompt: buildInfographicPrompt(profile, lang, labels, settings.aspectRatio),
      cautions: pick(profile.cautions, lang),
    };
  }
}

export const generationService: GenerationService = new LocalGenerationService();
