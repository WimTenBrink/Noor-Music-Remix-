export interface Dialect {
  id: string; // e.g. 'en-GB'
  name: string; // e.g. 'British English'
  description?: string;
}

export interface LanguageGroup {
  id: string; // e.g. 'english'
  name: string; // e.g. 'English'
  dialects: Dialect[];
}
