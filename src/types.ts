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

export interface SoraConfig {
  model: 'sora-2' | 'sora-2-pro';
  duration: 5 | 10 | 20;
  aspectRatio: '16:9' | '9:16' | '1:1';
  resolution: '720p' | '1080p';
}

export interface SoraJobState {
  jobId: string | null;
  status: 'idle' | 'requesting' | 'queued' | 'in_progress' | 'completed' | 'failed' | 'error' | 'timeout';
  videoUrl: string;
  error?: string;
  progress?: number | null;
}
