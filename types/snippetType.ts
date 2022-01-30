import { CategoryType } from "./categoryType";

export type SnippetType = {
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  isFeatured: boolean;
  category: CategoryType;
  updatedAt: string;
  createdAt: string;
};
