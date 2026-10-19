export interface ArticlesResponseData {
  articles?: Article[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArticleCategory {
  _id: string;
  id?: string | number;
  name: string;
  slug: string;
  status?: boolean;
  description?: string | null;
  createdAt?: string;
  canonical_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_type?: string | null;
  og_image?: string | null;
  schema?: string | null;
}

export interface BlogCategoryResponseData extends ArticleCategory {
  blogs?: Article[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArticleAuthor {
  _id?: string;
  id?: number;
  name?: string | null;
  profile_pic?: string | null;
}

export interface Article {
  _id: string;
  id?: number;
  title: string;
  slug: string;
  image?: string | null;
  status?: boolean;
  tags?: string[] | null;
  category?: ArticleCategory | string | null;
  description?: string | null;
  createdBy?: ArticleAuthor | null;
  canonical_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_type?: string | null;
  og_image?: string | null;
  schema?: string | null;
  comments?: unknown[] | null;
  createdAt?: string;
  updatedAt?: string;
}
