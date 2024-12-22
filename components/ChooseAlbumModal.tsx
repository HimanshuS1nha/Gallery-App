import { View, Text, Modal, Pressable, Alert } from "react-native";
import React from "react";
import tw from "twrnc";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";

import { useAlbums } from "@/hooks/useAlbums";
import { usePhotos } from "@/hooks/usePhotos";
import { useChooseAlbumModal } from "@/hooks/useChooseAlbumModal";
import { useSelectedItems } from "@/hooks/useSelectedItems";
import { useCreateAlbumModal } from "@/hooks/useCreateAlbumModal";

const ChooseAlbumModal = () => {
  const { albums, setAlbumPhotos } = useAlbums();
  const setPhotos = usePhotos((state) => state.setPhotos);
  const { isVisible, setIsVisible } = useChooseAlbumModal();
  const showCreateAlbumModal = useCreateAlbumModal(
    (state) => state.setIsVisible
  );
  const { selectedPhotos, setSelectedPhotos } = useSelectedItems();
  const queryClient = useQueryClient();

  const { mutate: handleMoveSelectedImagesToAlbum, isPending } = useMutation({
    mutationKey: ["move-selected-images-to-album"],
    mutationFn: async (album: MediaLibrary.Album) => {
      const isMoveSuccessful = await MediaLibrary.addAssetsToAlbumAsync(
        selectedPhotos,
        album,
        false
      );
      if (!isMoveSuccessful) {
        throw new Error("Some error occured");
      }

      return true;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-photos"] });
      await queryClient.invalidateQueries({ queryKey: ["get-album-photos"] });
      await queryClient.invalidateQueries({ queryKey: ["get-albums"] });

      setPhotos([]);
      setAlbumPhotos([]);
      setSelectedPhotos([]);
      setIsVisible(false);
    },
    onError: () => {
      Alert.alert("Error", "Some error occured");
    },
  });
  return (
    <Modal animationType="slide" transparent visible={isVisible}>
      <View style={tw`flex-1 bg-gray-100/70`}>
        <View
          style={tw`absolute w-[90%] m-4 p-6 shadow shadow-black bg-white bottom-0 gap-y-5 rounded-xl`}
        >
          <Pressable
            style={tw`absolute right-2 top-2`}
            onPress={() => setIsVisible(false)}
          >
            <Ionicons name="close" size={23} color="black" />
          </Pressable>
          <Text style={tw`text-base font-medium`}>Choose an album</Text>

          <View style={tw`gap-y-3`}>
            {albums.map((album) => {
              return (
                <Pressable
                  key={album.id}
                  style={tw`p-2 rounded-full bg-gray-50 flex-row justify-between items-center rounded-full`}
                  onPress={() => handleMoveSelectedImagesToAlbum(album)}
                  disabled={isPending}
                >
                  <Text style={tw`font-medium`}>{album.title}</Text>
                  <Text>{album.assetCount}</Text>
                </Pressable>
              );
            })}
            <Pressable
              style={tw`p-2 rounded-full bg-gray-50 flex-row justify-between items-center rounded-full`}
              onPress={() => {
                setIsVisible(false);
                showCreateAlbumModal(true);
              }}
            >
              <Text style={tw`text-blue-600 font-medium`}>
                Create new album
              </Text>
              <AntDesign name="pluscircle" size={20} color="blue" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChooseAlbumModal;
