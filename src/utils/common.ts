export const countWords = (text: string) => {
  // 將字串中多個空白取代成單一空白，並去除頭尾空白
  const cleanedText = text.trim().replace(/\s+/g, " ");

  if (!cleanedText) return 0;
  // 使用正則表達式分割文字（中文、英文、數字都會被視為字詞）
  const words = cleanedText.replace(/[^\p{L}\p{N}]/gu, "");
  return words ? words.length : 0;
};
