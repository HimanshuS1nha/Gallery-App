import { Pressable, Image, View } from "react-native";
import React, { useCallback } from "react";
import { Asset } from "expo-media-library";
import tw from "twrnc";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import { usePhotos } from "@/hooks/usePhotos";
import { useSelectedItems } from "@/hooks/useSelectedItems";

const PhotoPreview = ({ photo }: { photo: Asset }) => {
  const setSelectedPhoto = usePhotos((state) => state.setSelectedPhoto);
  const { selectedPhotos, setSelectedPhotos } = useSelectedItems();

  const checkIfPhotoIsSelected = useCallback(() => {
    let isPhotoSelected = false;

    selectedPhotos.map((selectedPhoto) => {
      if (selectedPhoto.id === photo.id) {
        isPhotoSelected = true;
      }
    });

    return isPhotoSelected;
  }, [selectedPhotos, photo]);
  return (
    <Pressable
      style={tw`w-full h-28 pr-0.5 pb-0.5`}
      onPress={() => {
        if (selectedPhotos.length > 0) {
          if (checkIfPhotoIsSelected()) {
            const newSelectedPhotos = selectedPhotos.filter(
              (selectedPhoto) => selectedPhoto.id !== photo.id
            );
            setSelectedPhotos(newSelectedPhotos);
          } else {
            const newSelectedPhotos = [...selectedPhotos, photo];
            setSelectedPhotos(newSelectedPhotos);
          }
        } else {
          setSelectedPhoto(photo);
          router.push("/photo");
        }
      }}
      onLongPress={() => {
        if (!checkIfPhotoIsSelected()) {
          const newSelectedPhotos = [...selectedPhotos, photo];
          setSelectedPhotos(newSelectedPhotos);
        }
      }}
    >
      <Image
        source={{ uri: photo.uri }}
        style={tw`w-full h-full`}
        resizeMode="stretch"
      />

      {selectedPhotos.length !== 0 && checkIfPhotoIsSelected() && (
        <View
          style={tw`absolute w-full h-full justify-center items-center bg-gray-100/70`}
        >
          <AntDesign name="check" size={30} color="black" />
        </View>
      )}
    </Pressable>
  );
};

export default PhotoPreview;
