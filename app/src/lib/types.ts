export interface Variant {
  id: string;
  poseLabel: string;
  description: string;
  prompt: string;
}

export interface Theme {
  id: string;
  name: string;
  tagline: string;
  color: string;
  variants: Variant[];
}

export interface ThemesData {
  themes: Theme[];
}

export interface FreeDimension {
  id: string;
  name: string;
  connector: string;
  keywords: string[];
}

export type PageRoute =
  | { name: 'home' }
  | { name: 'themes' }
  | { name: 'variants'; themeId: string }
  | { name: 'free' }
  | {
      name: 'result';
      breadcrumb: string;
      prompt: string;
      from: 'template' | 'free';
      themeId?: string;
    };
