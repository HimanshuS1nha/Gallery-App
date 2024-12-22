import { create } from "zustand";

type UseCreateAlbumModalType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const useCreateAlbumModal = create<UseCreateAlbumModalType>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
}));
