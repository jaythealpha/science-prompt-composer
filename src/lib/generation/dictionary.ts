import type { ScienceCategory, VisualScale, VisualStyle } from "../types";

export const CATEGORY_KEYWORDS: Record<ScienceCategory, string[]> = {
  physics: [
    "physics", "force", "energy", "quantum", "electron", "magnetic", "electric",
    "induction", "superconduct", "fission", "fusion", "wave", "particle", "voltage",
    "current", "gravity", "momentum", "물리", "전자", "자기", "전류", "에너지", "힘",
    "物理", "電子", "磁", "電流", "エネルギー", "力", "量子", "核分裂", "超伝導",
  ],
  chemistry: [
    "chemistry", "chemical", "reaction", "molecule", "bond", "electrolysis", "combustion",
    "oxidation", "acid", "base", "compound", "ion", "atom react", "catalyst", "burning",
    "화학", "반응", "분자", "결합", "전기분해", "연소", "산화", "이온",
    "化学", "反応", "分子", "結合", "電気分解", "燃焼", "酸化", "イオン",
  ],
  biology: [
    "biology", "cell", "dna", "mitosis", "osmosis", "photosynthesis", "membrane",
    "organism", "protein", "enzyme", "chromosome", "genetic", "replication", "tissue",
    "생물", "세포", "삼투", "광합성", "분열", "유전", "효소", "단백질", "막",
    "生物", "細胞", "浸透", "光合成", "分裂", "遺伝", "酵素", "タンパク質", "細胞膜",
  ],
  earth: [
    "earth", "geology", "volcano", "volcanic", "tectonic", "plate", "lightning", "weather",
    "climate", "greenhouse", "erosion", "atmosphere", "magma", "earthquake", "ocean",
    "지구", "지질", "화산", "판", "번개", "기후", "온실", "대기", "마그마", "지진",
    "地球", "地質", "火山", "プレート", "雷", "気候", "温室", "大気", "マグマ", "地震",
  ],
  space: [
    "space", "astronomy", "black hole", "aurora", "star", "galaxy", "cosmic", "solar",
    "planet", "nebula", "accretion", "orbit", "universe", "supernova", "gravitational lens",
    "우주", "천문", "블랙홀", "오로라", "별", "은하", "태양", "행성", "강착",
    "宇宙", "天文", "ブラックホール", "オーロラ", "星", "銀河", "太陽", "惑星", "降着",
  ],
};

export const SCALE_KEYWORDS: Record<VisualScale, string[]> = {
  cosmic: ["black hole", "galaxy", "cosmic", "universe", "nebula", "star", "블랙홀", "은하", "우주", "ブラックホール", "銀河", "宇宙"],
  planetary: ["earth", "planet", "aurora", "tectonic", "atmosphere", "지구", "행성", "대기", "오로라", "地球", "惑星", "大気", "オーロラ"],
  landscape: ["volcano", "lightning", "storm", "mountain", "landscape", "화산", "번개", "폭풍", "산", "火山", "雷", "嵐", "山"],
  human: ["generator", "coil", "apparatus", "device", "machine", "발전기", "코일", "장치", "発電機", "コイル", "装置"],
  microscopic: ["cell", "photosynthesis", "mitosis", "tissue", "세포", "광합성", "분열", "조직", "細胞", "光合成", "分裂", "組織"],
  molecular: ["molecule", "osmosis", "dna", "bond", "electrolysis", "combustion", "분자", "삼투", "결합", "分子", "浸透", "結合", "電気分解", "燃焼"],
  atomic: ["atom", "fission", "electron", "nucleus", "superconduct", "원자", "핵분열", "전자", "핵", "原子", "核分裂", "電子", "原子核", "超伝導"],
  subatomic: ["quark", "subatomic", "particle physics", "쿼크", "소립자", "クォーク", "素粒子"],
};

export const STYLE_LABEL: Record<VisualStyle, { en: string; ko: string; ja: string }> = {
  infographic: { en: "Scientific Infographic", ko: "과학 인포그래픽", ja: "科学インフォグラフィック" },
  cinematic: { en: "Cinematic Documentary", ko: "시네마틱 다큐멘터리", ja: "シネマティック・ドキュメンタリー" },
  photorealistic: { en: "Photorealistic 3D", ko: "포토리얼 3D", ja: "フォトリアル3D" },
  textbook: { en: "Clean Textbook Visual", ko: "깔끔한 교과서 비주얼", ja: "クリーンな教科書ビジュアル" },
  futuristic: { en: "Futuristic Scientific", ko: "미래적 과학 비주얼", ja: "未来的サイエンスビジュアル" },
};

export const STYLE_DIRECTIVE: Record<VisualStyle, { en: string; ko: string; ja: string }> = {
  infographic: {
    en: "clean scientific infographic styling with crisp vector diagrams, callout lines, and a structured educational layout",
    ko: "선명한 벡터 다이어그램, 지시선, 구조적인 교육용 레이아웃을 갖춘 깔끔한 과학 인포그래픽 스타일",
    ja: "鮮明なベクター図、引き出し線、構造化された教育的レイアウトを備えたクリーンな科学インフォグラフィックスタイル",
  },
  cinematic: {
    en: "cinematic documentary lighting with dramatic depth, volumetric glow, and premium film-grade color grading",
    ko: "극적인 깊이감, 볼류메트릭 글로우, 프리미엄 영화급 색보정을 갖춘 시네마틱 다큐멘터리 조명",
    ja: "劇的な奥行き、ボリューメトリックな光、プレミアムな映画品質のカラーグレーディングを備えたシネマティックなドキュメンタリー照明",
  },
  photorealistic: {
    en: "photorealistic 3D rendering with physically based materials, realistic lighting, and fine surface detail",
    ko: "물리 기반 재질, 사실적인 조명, 정밀한 표면 디테일을 갖춘 포토리얼 3D 렌더링",
    ja: "物理ベースのマテリアル、リアルな照明、精緻な表面ディテールを備えたフォトリアルな3Dレンダリング",
  },
  textbook: {
    en: "clean textbook illustration with flat clear shapes, restrained color, and unambiguous labeling",
    ko: "평평하고 명확한 형태, 절제된 색상, 분명한 라벨을 갖춘 깔끔한 교과서 일러스트",
    ja: "フラットで明快な形状、抑えた色使い、明確なラベルを備えたクリーンな教科書イラスト",
  },
  futuristic: {
    en: "futuristic scientific holographic styling with glowing edges, HUD-style annotations, and a high-tech palette",
    ko: "빛나는 윤곽선, HUD 스타일 주석, 하이테크 팔레트를 갖춘 미래적 과학 홀로그램 스타일",
    ja: "発光するエッジ、HUD風の注釈、ハイテクなパレットを備えた未来的な科学ホログラムスタイル",
  },
};

export const CATEGORY_LABEL: Record<ScienceCategory, { en: string; ko: string; ja: string }> = {
  physics: { en: "Physics", ko: "물리학", ja: "物理学" },
  chemistry: { en: "Chemistry", ko: "화학", ja: "化学" },
  biology: { en: "Biology", ko: "생물학", ja: "生物学" },
  earth: { en: "Earth Science", ko: "지구과학", ja: "地球科学" },
  space: { en: "Space Science", ko: "우주과학", ja: "宇宙科学" },
};

export const SCALE_LABEL: Record<VisualScale, { en: string; ko: string; ja: string }> = {
  cosmic: { en: "cosmic scale", ko: "우주 규모", ja: "宇宙スケール" },
  planetary: { en: "planetary scale", ko: "행성 규모", ja: "惑星スケール" },
  landscape: { en: "landscape scale", ko: "지형 규모", ja: "地形スケール" },
  human: { en: "human / apparatus scale", ko: "인체·장치 규모", ja: "人体・装置スケール" },
  microscopic: { en: "microscopic scale", ko: "미시 규모", ja: "微視的スケール" },
  molecular: { en: "molecular scale", ko: "분자 규모", ja: "分子スケール" },
  atomic: { en: "atomic scale", ko: "원자 규모", ja: "原子スケール" },
  subatomic: { en: "subatomic scale", ko: "아원자 규모", ja: "亜原子スケール" },
};
