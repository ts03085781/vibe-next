export const genreList = [
  { label: "熱血", value: "熱血" },
  { label: "冒險", value: "冒險" },
  { label: "推理", value: "推理" },
  { label: "懸疑", value: "懸疑" },
  { label: "恐怖", value: "恐怖" },
  { label: "神鬼", value: "神鬼" },
  { label: "搞笑", value: "搞笑" },
  { label: "愛情", value: "愛情" },
  { label: "科幻", value: "科幻" },
  { label: "魔法", value: "魔法" },
  { label: "格鬥", value: "格鬥" },
  { label: "武俠", value: "武俠" },
  { label: "戰爭", value: "戰爭" },
  { label: "競技", value: "競技" },
  { label: "體育", value: "體育" },
  { label: "校園", value: "校園" },
  { label: "生活", value: "生活" },
  { label: "勵志", value: "勵志" },
  { label: "歷史", value: "歷史" },
  { label: "宅男", value: "宅男" },
  { label: "腐女", value: "腐女" },
  { label: "治癒", value: "治癒" },
  { label: "美食", value: "美食" },
  { label: "社會", value: "社會" },
  { label: "音樂", value: "音樂" },
];

export const audienceList = [
  { label: "少年", value: "少年" },
  { label: "少女", value: "少女" },
  { label: "青年", value: "青年" },
  { label: "兒童", value: "兒童" },
  { label: "成人", value: "成人" },
];

export const yearList = [
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
];

export const alphaList = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
  { label: "D", value: "D" },
  { label: "E", value: "E" },
  { label: "F", value: "F" },
  { label: "G", value: "G" },
  { label: "H", value: "H" },
  { label: "I", value: "I" },
  { label: "J", value: "J" },
  { label: "K", value: "K" },
  { label: "L", value: "L" },
  { label: "M", value: "M" },
  { label: "N", value: "N" },
  { label: "O", value: "O" },
  { label: "P", value: "P" },
  { label: "Q", value: "Q" },
  { label: "R", value: "R" },
  { label: "S", value: "S" },
  { label: "T", value: "T" },
  { label: "U", value: "U" },
  { label: "V", value: "V" },
  { label: "W", value: "W" },
  { label: "X", value: "X" },
  { label: "Y", value: "Y" },
  { label: "Z", value: "Z" },
];

export const statusList = [
  { label: "連載", value: "連載" },
  { label: "完結", value: "完結" },
];

export const filterConfig = [
  {
    label: "劇情",
    key: "genre",
    options: [{ label: "全部", value: "all" }, ...genreList],
  },
  {
    label: "受眾",
    key: "audience",
    options: [{ label: "全部", value: "all" }, ...audienceList],
  },
  {
    label: "年份",
    key: "year",
    options: [{ label: "全部", value: "all" }, ...yearList],
  },
  {
    label: "字母",
    key: "alpha",
    options: [{ label: "全部", value: "all" }, ...alphaList],
  },
  {
    label: "進度",
    key: "status",
    options: [{ label: "全部", value: "all" }, ...statusList],
  },
];
