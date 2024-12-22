import { View, Text, Modal, Pressable, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useCreateAlbumModal } from "@/hooks/useCreateAlbumModal";
import { useSelectedItems } from "@/hooks/useSelectedItems";
import { useAlbums } from "@/hooks/useAlbums";
import { usePhotos } from "@/hooks/usePhotos";

const CreateAlbumModal = () => {
  const { isVisible, setIsVisible } = useCreateAlbumModal();
  const { selectedPhotos, setSelectedPhotos } = useSelectedItems();
  const setAlbumPhotos = useAlbums((state) => state.setAlbumPhotos);
  const setPhotos = usePhotos((state) => state.setPhotos);
  const queryClient = useQueryClient();

  const [albumName, setAlbumName] = useState("");

  const { mutate: handleCreateAlbum, isPending } = useMutation({
    mutationKey: ["move-selected-images-to-album"],
    mutationFn: async () => {
      const newAlbum = await MediaLibrary.createAlbumAsync(
        albumName,
        selectedPhotos[0],
        false
      );

      if (selectedPhotos.length > 1) {
        await MediaLibrary.addAssetsToAlbumAsync(
          selectedPhotos.slice(1),
          newAlbum,
          false
        );
      }

      return true;
    },
    onSuccess: async () => {
      setPhotos([]);
      setAlbumPhotos([]);
      setSelectedPhotos([]);
      
      await queryClient.invalidateQueries({ queryKey: ["get-photos"] });
      await queryClient.invalidateQueries({ queryKey: ["get-album-photos"] });
      await queryClient.invalidateQueries({ queryKey: ["get-albums"] });

      setIsVisible(false);
      router.back();
    },
    onError: () => {
      Alert.alert("Error", "Some error occured");
    },
  });
  return (
    <Modal animationType="slide" transparent visible={isVisible}>
      <View style={tw`flex-1 items-center justify-center bg-gray-100/70`}>
        <View
          style={tw`bg-white w-[70%] rounded-lg p-6 gap-y-6 shadow shadow-black`}
        >
          <Pressable
            style={tw`absolute right-2 top-2`}
            onPress={() => setIsVisible(false)}
          >
            <Ionicons name="close" size={23} color="black" />
          </Pressable>

          <Text style={tw`text-base font-medium text-center`}>
            Create an album
          </Text>

          <TextInput
            placeholder="Enter name of album"
            style={tw`border rounded-full px-4`}
            value={albumName}
            onChangeText={setAlbumName}
          />

          <Pressable
            style={tw`items-center justify-center ${
              isPending ? "bg-blue-300" : "bg-blue-600"
            } py-2.5 rounded-full`}
            onPress={() => handleCreateAlbum()}
            disabled={isPending}
          >
            <Text style={tw`text-white font-medium`}>
              {isPending ? "Please wait..." : "Create"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default CreateAlbumModal;
