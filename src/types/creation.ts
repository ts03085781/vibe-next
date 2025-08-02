// 創作專區相關的 TypeScript 類型定義

// 作品創建/編輯表單介面
export interface ICreationForm {
  title: string;
  description: string;
  coverImage?: string;
  genre: string[];
  audience: string;
  status: string;
  alpha: string;
  tag: string;
}

// 章節創建/編輯表單介面
export interface IChapterForm {
  title: string;
  content: string;
  chapterNumber: number;
}

// 作品列表項目介面
export interface ICreationListItem {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  totalChapters: number;
  status: string;
  rating: number;
  tag: string;
  createDate: Date;
  updateDate: Date;
  authorId: string;
  authorNickname: string;
  authorUsername: string;
}

// 章節列表項目介面
export interface IChapterListItem {
  _id: string;
  mangaId: string;
  chapterNumber: number;
  title: string;
  content: string;
  publishDate: Date;
}

// API 回應介面
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// 創作專區篩選選項
export interface ICreationFilters {
  status?: string;
  page?: number;
  limit?: number;
}
