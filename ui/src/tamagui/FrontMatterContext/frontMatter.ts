export interface FrontMatter {
  title: string;
  description?: string;
  name?: string;
  versions?: string[];
  version?: string;
  by?: string;
  publishedAt?: string;
  relatedIds?: string[];
  type?: 'changelog' | string;
  readingTime?: { text: string; minutes: number; time: number; words: number };
  poster?: string;
  slug: string;
  image?: string;
  component?: string;
  package?: string;
}
