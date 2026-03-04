import { useEffect, useState } from 'react';
import { BuilderSnapshot, SavedPreset } from '../types';

const STORAGE_KEY = 'prompt-builder.presets';
const MAX_PRESETS = 5;

const makeId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

const safeParse = (value: string | null): SavedPreset[] => {
  if (!value) return [];
  try {
    return JSON.parse(value) as SavedPreset[];
  } catch {
    return [];
  }
};

const loadFromStorage = (): SavedPreset[] => {
  if (typeof window === 'undefined') return [];
  try {
    return safeParse(window.localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    console.warn('[Prompt Builder] localStorage unavailable, presets kept in-memory only.', error);
    return [];
  }
};

const persistToStorage = (value: SavedPreset[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    console.warn('[Prompt Builder] Failed to persist presets, storage disabled?', error);
  }
};

export const usePresets = () => {
  const [presets, setPresets] = useState<SavedPreset[]>(() => loadFromStorage());

  useEffect(() => {
    persistToStorage(presets);
  }, [presets]);

  const savePreset = (name: string, snapshot: BuilderSnapshot) => {
    if (!name.trim()) return;
    setPresets(prev => {
      const deduped = prev.filter(p => p.name !== name.trim());
      const next: SavedPreset = {
        id: makeId(),
        name: name.trim(),
        savedAt: new Date().toISOString(),
        snapshot
      };
      return [next, ...deduped].slice(0, MAX_PRESETS);
    });
  };

  const removePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  };

  return { presets, savePreset, removePreset };
};
