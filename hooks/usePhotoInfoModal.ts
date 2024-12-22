import { create } from "zustand";

type UsePhotoInfoModalType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const usePhotoInfoModal = create<UsePhotoInfoModalType>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
}));
