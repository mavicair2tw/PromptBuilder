export type Language = 'zh' | 'en';

export interface Option {
  id: string;
  zh: string;
  en: string;
}

export interface CameraOption extends Option {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

export interface Segment {
  id: string;
  label: string;
  subjectId?: string;
  actionId?: string;
  environmentId?: string;
  cameraId?: string;
  notes: string;
}

export interface GlobalFormState {
  subjectId: string;
  actionId: string;
  environmentId: string;
  cameraId: string;
  styleIds: string[];
  language: Language;
  negativePrompt: string;
  lensNotes: string;
}

export interface CustomOptions {
  subjects: Option[];
  actions: Option[];
  environments: Option[];
}

export interface BuilderSnapshot {
  global: GlobalFormState;
  segments: Segment[];
  customOptions: CustomOptions;
}

export interface SavedPreset {
  id: string;
  name: string;
  savedAt: string;
  snapshot: BuilderSnapshot;
}
