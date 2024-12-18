import { Asset } from "expo-media-library";
import { create } from "zustand";

type UsePhotosType = {
  photos: Asset[];
  setPhotos: (photos: Asset[]) => void;
  selectedPhoto: Asset | null;
  setSelectedPhoto: (selectedPhoto: Asset | null) => void;
};

export const usePhotos = create<UsePhotosType>((set) => ({
  photos: [],
  selectedPhoto: null,
  setPhotos: (photos) => set({ photos }),
  setSelectedPhoto: (selectedPhoto) => set({ selectedPhoto }),
}));
