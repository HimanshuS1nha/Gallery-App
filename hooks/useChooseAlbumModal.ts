import type { Asset } from "expo-media-library";
import { create } from "zustand";

type UseChooseAlbumModalType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const useChooseAlbumModal = create<UseChooseAlbumModalType>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
}));
