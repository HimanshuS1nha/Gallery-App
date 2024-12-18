import { Album } from "expo-media-library";
import { create } from "zustand";

type UseAlbumsType = {
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
  selectedAlbum: Album | null;
  setSelectedAlbum: (selectedAlbum: Album | null) => void;
};

export const useAlbums = create<UseAlbumsType>((set) => ({
  albums: [],
  selectedAlbum: null,
  setAlbums: (albums) => set({ albums }),
  setSelectedAlbum: (selectedAlbum) => set({ selectedAlbum }),
}));
