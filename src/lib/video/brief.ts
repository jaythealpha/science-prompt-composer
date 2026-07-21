import type { GenerationResult, GenerationSettings, Language } from "../types";
import { STYLE_LABEL } from "../generation/dictionary";

export type Platform = "shorts" | "reels" | "tiktok";

export type ShotRole = "hook" | "cause" | "mechanism" | "result" | "payoff";

export interface StoryboardShot {
  index: number;
  role: ShotRole;
  durationSec: number;
  caption: string;
  narration: string;
  imagePrompt: string;
  motionPrompt: string;
}

export interface VideoBrief {
  platform: Platform;
  aspectRatio: "9:16";
  totalDurationSec: number;
  hooks: string[];
  shots: StoryboardShot[];
  titleOptions: string[];
  description: string;
  hashtags: string[];
  thumbnailText: string;
}

export const PLATFORM_META: Record<Platform, { label: string; targetSec: number }> = {
  shorts: { label: "YouTube Shorts", targetSec: 40 },
  reels: { label: "Instagram Reels", targetSec: 30 },
  tiktok: { label: "TikTok", targetSec: 27 },
};

type L3 = { en: string; ko: string; ja: string };
function L(lang: Language, node: L3): string {
  return node[lang];
}

function firstClause(text: string): string {
  const cut = text.split(/[,，、;；]/)[0].trim();
  return cut.length > 4 ? cut : text;
}

function buildHooks(result: GenerationResult, lang: Language): string[] {
  const title = result.title;
  if (lang === "ko") {
    return [
      `${title}, 왜 일어날까? 대부분이 잘못 알고 있습니다.`,
      `이건 마법이 아니라 과학입니다 — ${title}의 진짜 원리.`,
      `3초 안에 이해하는 ${title}.`,
    ];
  }
  if (lang === "ja") {
    return [
      `${title}はなぜ起きる？ほとんどの人が誤解しています。`,
      `これは魔法ではなく科学です — ${title}の本当の仕組み。`,
      `3秒で分かる${title}。`,
    ];
  }
  return [
    `Why does ${title} happen? Most people get this wrong.`,
    `This isn't magic — it's science. The real mechanism behind ${title}.`,
    `${title}, explained in 3 seconds.`,
  ];
}

function beatCaption(role: ShotRole, lang: Language, keyTerm: string): string {
  const labels: Record<ShotRole, L3> = {
    hook: { en: "Watch this", ko: "잠깐, 이거 보세요", ja: "ちょっと見て" },
    cause: { en: "① The cause", ko: "① 원인", ja: "① 原因" },
    mechanism: { en: "② How it works", ko: "② 작동 원리", ja: "② 仕組み" },
    result: { en: "③ The result", ko: "③ 결과", ja: "③ 結果" },
    payoff: { en: "Now you know", ko: "이제 아시겠죠", ja: "これで分かった" },
  };
  const label = L(lang, labels[role]);
  return keyTerm ? `${label} · ${keyTerm}` : label;
}

function motionFor(role: ShotRole, subject: string, lang: Language): string {
  const dir: Record<ShotRole, L3> = {
    hook: { en: "slow cinematic push-in", ko: "느린 시네마틱 푸시인", ja: "ゆっくりしたシネマティックなプッシュイン" },
    cause: { en: "elements drift inward", ko: "요소들이 안쪽으로 흘러 들어옴", ja: "要素が内側へ流れ込む" },
    mechanism: { en: "energy/particles flow along the process", ko: "에너지·입자가 과정을 따라 흐름", ja: "エネルギー・粒子が過程に沿って流れる" },
    result: { en: "the result blooms and settles", ko: "결과가 피어나며 안정됨", ja: "結果が広がって落ち着く" },
    payoff: { en: "smooth pull-out to a hero wide shot", ko: "히어로 와이드로 부드럽게 풀아웃", ja: "ヒーローワイドへ滑らかにプルアウト" },
  };
  if (lang === "ko") {
    return `애니메이션: ${subject}. ${L(lang, dir[role])}, 미묘한 패럴랙스, 3~4초, 루프에 자연스럽게.`;
  }
  if (lang === "ja") {
    return `アニメーション: ${subject}。${L(lang, dir[role])}、繊細なパララックス、3〜4秒、ループしやすく。`;
  }
  return `Animate: ${subject}. ${L(lang, dir[role])}, subtle parallax, 3–4 seconds, loop-friendly.`;
}

function shotImagePrompt(
  focus: string,
  styleName: string,
  lang: Language,
): string {
  if (lang === "ko") {
    return `${focus}. ${styleName}, 9:16 세로 구도, 자막용으로 상·하단 여백 확보. 과학적으로 정확하게.`;
  }
  if (lang === "ja") {
    return `${focus}。${styleName}、9:16 縦構図、字幕用に上下の余白を確保。科学的に正確に。`;
  }
  return `${focus}. ${styleName}, vertical 9:16 composition with safe top/bottom margins for captions. Scientifically accurate.`;
}

function buildTitleOptions(result: GenerationResult, lang: Language): string[] {
  const title = result.title;
  if (lang === "ko") {
    return [
      `${title}, 30초 만에 이해하기`,
      `${title}이(가) 일어나는 진짜 이유`,
      `아무도 제대로 설명 안 해준 ${title}`,
    ];
  }
  if (lang === "ja") {
    return [
      `30秒で分かる${title}`,
      `${title}が起きる本当の理由`,
      `誰も正しく説明しない${title}`,
    ];
  }
  return [
    `${title}, explained in 30 seconds`,
    `The real reason ${title} happens`,
    `${title} — the part nobody explains`,
  ];
}

function buildHashtags(result: GenerationResult): string[] {
  const topic = result.title
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .slice(0, 24);
  const categoryTag: Record<GenerationResult["detectedCategory"], string> = {
    physics: "physics",
    chemistry: "chemistry",
    biology: "biology",
    earth: "earthscience",
    space: "space",
  };
  const base = [
    "science",
    categoryTag[result.detectedCategory],
    "scied",
    "learnontiktok",
    "sciencetok",
    "shorts",
    "reels",
  ];
  const tags = [...(topic ? [topic] : []), ...base];
  // De-dupe, prefix with '#'.
  return Array.from(new Set(tags)).map((t) => `#${t}`);
}

function buildThumbnailText(result: GenerationResult, lang: Language): string {
  if (lang === "ko") return `${result.title}?!`;
  if (lang === "ja") return `${result.title}とは？！`;
  return `${result.title.toUpperCase()}?!`;
}

export function buildVideoBrief(
  result: GenerationResult,
  settings: GenerationSettings,
  platform: Platform,
  lang: Language,
): VideoBrief {
  const styleName = L(lang, STYLE_LABEL[settings.style]);
  const target = PLATFORM_META[platform].targetSec;
  const hookSec = 3;
  const payoffSec = 3;
  const middle = Math.max(target - hookSec - payoffSec, 12);
  const per = Math.round((middle / 3) * 10) / 10;

  const ve = result.visualElements;
  const hooks = buildHooks(result, lang);

  const followCta = L(lang, {
    en: "Follow for one science phenomenon a day.",
    ko: "매일 과학 현상 하나씩 — 팔로우하세요.",
    ja: "毎日ひとつの科学現象 — フォローしてね。",
  });

  const shots: StoryboardShot[] = [
    {
      index: 1,
      role: "hook",
      durationSec: hookSec,
      caption: beatCaption("hook", lang, ""),
      narration: hooks[0],
      imagePrompt: shotImagePrompt(
        L(lang, {
          en: `A striking establishing shot of ${result.title}`,
          ko: `${result.title}의 강렬한 설정 샷`,
          ja: `${result.title}の印象的な導入ショット`,
        }),
        styleName,
        lang,
      ),
      motionPrompt: motionFor("hook", result.title, lang),
    },
    {
      index: 2,
      role: "cause",
      durationSec: per,
      caption: beatCaption("cause", lang, result.labels[0] ?? ""),
      narration: result.cause,
      imagePrompt: shotImagePrompt(firstClause(ve[0] ?? result.cause), styleName, lang),
      motionPrompt: motionFor("cause", firstClause(ve[0] ?? result.cause), lang),
    },
    {
      index: 3,
      role: "mechanism",
      durationSec: per,
      caption: beatCaption("mechanism", lang, result.labels[1] ?? ""),
      narration: result.mechanism,
      imagePrompt: shotImagePrompt(firstClause(ve[1] ?? result.mechanism), styleName, lang),
      motionPrompt: motionFor("mechanism", firstClause(ve[1] ?? result.mechanism), lang),
    },
    {
      index: 4,
      role: "result",
      durationSec: per,
      caption: beatCaption("result", lang, result.labels[2] ?? ""),
      narration: result.result,
      imagePrompt: shotImagePrompt(firstClause(ve[2] ?? ve[ve.length - 1] ?? result.result), styleName, lang),
      motionPrompt: motionFor("result", firstClause(ve[2] ?? result.result), lang),
    },
    {
      index: 5,
      role: "payoff",
      durationSec: payoffSec,
      caption: beatCaption("payoff", lang, ""),
      narration: `${firstClause(result.overview)} ${followCta}`,
      imagePrompt: shotImagePrompt(
        L(lang, {
          en: `A clean hero wide shot summarizing ${result.title}`,
          ko: `${result.title}을(를) 요약하는 깔끔한 히어로 와이드 샷`,
          ja: `${result.title}を要約するクリーンなヒーローワイドショット`,
        }),
        styleName,
        lang,
      ),
      motionPrompt: motionFor("payoff", result.title, lang),
    },
  ];

  const totalDurationSec = shots.reduce((sum, s) => sum + s.durationSec, 0);
  const hashtags = buildHashtags(result);

  return {
    platform,
    aspectRatio: "9:16",
    totalDurationSec: Math.round(totalDurationSec),
    hooks,
    shots,
    titleOptions: buildTitleOptions(result, lang),
    description: `${result.overview}\n\n${hashtags.join(" ")}`,
    hashtags,
    thumbnailText: buildThumbnailText(result, lang),
  };
}

export function buildVideoBriefJson(
  brief: VideoBrief,
  input: string,
  result: GenerationResult,
): string {
  return JSON.stringify(
    {
      source: {
        input,
        phenomenon: result.title,
        category: result.detectedCategory,
      },
      platform: brief.platform,
      aspectRatio: brief.aspectRatio,
      totalDurationSec: brief.totalDurationSec,
      hooks: brief.hooks,
      titleOptions: brief.titleOptions,
      description: brief.description,
      hashtags: brief.hashtags,
      thumbnailText: brief.thumbnailText,
      shots: brief.shots,
      captionsPolicy:
        "Render on-screen text as an editor overlay/subtitle track, not baked into image/video generation. AI models render CJK (Korean/Japanese) text unreliably.",
    },
    null,
    2,
  );
}
