import { Pressable, Image } from "react-native";
import React from "react";
import { Asset } from "expo-media-library";
import tw from "twrnc";
import { router } from "expo-router";

import { usePhotos } from "@/hooks/usePhotos";

const PhotoPreview = ({ photo }: { photo: Asset }) => {
  const setSelectedPhoto = usePhotos((state) => state.setSelectedPhoto);
  return (
    <Pressable
      style={tw`w-full h-28 pr-0.5 pb-0.5`}
      onPress={() => {
        setSelectedPhoto(photo);
        router.push("/photo");
      }}
    >
      <Image
        source={{ uri: photo.uri }}
        style={tw`w-full h-full`}
        resizeMode="stretch"
      />
    </Pressable>
  );
};

export default PhotoPreview;
