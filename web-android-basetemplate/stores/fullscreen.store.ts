import { create } from 'zustand';

interface FullscreenState {
  isFullscreen: boolean;
  setFullscreen: (value: boolean) => void;
}

export const useFullscreenStore =
  create<FullscreenState>((set) => ({
    isFullscreen: false,

    setFullscreen: (value) =>
      set({
        isFullscreen: value,
      }),
  }));