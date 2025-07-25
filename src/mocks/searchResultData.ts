import { SearchResultCardProps } from "@/components/SearchResultCard";

export const mockSearchResults: SearchResultCardProps[] = [
  {
    _id: "1",
    title: "魔法世界的日記",
    description:
      "一個由魔法組成的世界，有一天突然遭到魔族入侵，主角卻是個無魔力的廢咖，但他擁有特殊的日記本，可以記錄並重現任何魔法...",
    coverImage: "/images/logo.png",
    rating: 9.0,
    totalChapters: 4,
    genre: ["魔法", "熱血", "冒險"],
    audience: "少年",
    status: "完結",
    year: 2025,
    alpha: "M",
    createDate: new Date("2025-07-17"),
    updateDate: new Date("2025-07-19"),
    collectionsCount: 1250,
    tag: "熱門",
  },
  {
    _id: "2",
    title: "良太殺死了弟弟",
    description:
      "一個關於家庭、背叛與救贖的深刻故事。良太在一個雨夜做出了改變一切的決定，但這個決定卻讓他重新認識了什麼是真正的愛...",
    coverImage: "/images/logo.png",
    rating: 8.5,
    totalChapters: 5,
    genre: ["懸疑", "心理", "家庭"],
    audience: "青年",
    status: "完結",
    year: 2025,
    alpha: "L",
    createDate: new Date("2025-07-14"),
    updateDate: new Date("2025-07-18"),
    collectionsCount: 890,
    tag: "完結",
  },
  {
    _id: "3",
    title: "魔法學院的秘密",
    description:
      "在神秘的魔法學院中，年輕的魔法師們發現了一個驚人的秘密。這個秘密將改變整個魔法世界的命運...",
    coverImage: "/images/logo.png",
    rating: 9.2,
    totalChapters: 3,
    genre: ["奇幻", "魔法", "校園"],
    audience: "少年",
    status: "連載中",
    year: 2025,
    alpha: "M",
    createDate: new Date("2025-07-15"),
    updateDate: new Date("2025-07-20"),
    collectionsCount: 2100,
    tag: "連載",
  },
  {
    _id: "4",
    title: "都市異能者",
    description:
      "在現代都市中，隱藏著一群擁有特殊能力的人。主角意外覺醒了操控時間的能力，從此捲入了一場驚天動地的陰謀...",
    coverImage: "/images/logo.png",
    rating: 8.8,
    totalChapters: 7,
    genre: ["都市", "異能", "懸疑"],
    audience: "青年",
    status: "連載中",
    year: 2025,
    alpha: "D",
    createDate: new Date("2025-07-10"),
    updateDate: new Date("2025-07-21"),
    collectionsCount: 1560,
    tag: "熱門",
  },
  {
    _id: "5",
    title: "星際探險家",
    description:
      "在遙遠的未來，人類已經開始探索宇宙的深處。一群勇敢的探險家發現了一個神秘的星球，但這個星球隱藏著可怕的秘密...",
    coverImage: "/images/logo.png",
    rating: 8.3,
    totalChapters: 6,
    genre: ["科幻", "冒險", "懸疑"],
    audience: "少年",
    status: "連載中",
    year: 2025,
    alpha: "X",
    createDate: new Date("2025-07-12"),
    updateDate: new Date("2025-07-22"),
    collectionsCount: 980,
    tag: "新作",
  },
];
