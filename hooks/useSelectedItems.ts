import type { Album, Asset } from "expo-media-library";
import { create } from "zustand";

type UseSelectedItemsType = {
  selectedPhotos: Asset[];
  setSelectedPhotos: (selectedPhotos: Asset[]) => void;
  selectedAlbums: Album[];
  setSelectedAlbums: (selectedPhotos: Album[]) => void;
};

export const useSelectedItems = create<UseSelectedItemsType>((set) => ({
  selectedAlbums: [],
  selectedPhotos: [],
  setSelectedAlbums: (selectedAlbums) => set({ selectedAlbums }),
  setSelectedPhotos: (selectedPhotos) => set({ selectedPhotos }),
}));
