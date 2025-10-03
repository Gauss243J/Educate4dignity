export interface BlogAuthor {
  id: string;
  name: string;
  role?: string;
  avatar_url?: string;
  bio?: string;
}

export interface BlogRelatedRef { title: string; slug: string; }

export interface BlogArticle {
  title: string;
  slug: string;
  category: string;
  tags?: string[];
  author: BlogAuthor;
  cover_image_url: string;
  cover_consent_verified?: boolean;
  published_at: string; // ISO date
  read_minutes: number;
  excerpt?: string;
  body_md: string; // markdown content
  callout_transparency?: string;
  related?: BlogRelatedRef[];
  seo_title?: string;
  seo_description?: string;
}

export interface BlogArticleIndexMeta {
  slug: string;
  title: string;
  category: string;
  tags?: string[];
  excerpt?: string;
  published_at: string;
  read_minutes: number;
  featured?: boolean;
}
