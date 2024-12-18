import { Pressable, Image } from "react-native";
import React from "react";
import { Asset } from "expo-media-library";
import tw from "twrnc";
import { router } from "expo-router";

const PhotoPreview = ({ photo }: { photo: Asset }) => {
  return (
    <Pressable
      style={tw`w-full h-28 pr-0.5 pb-0.5`}
      onPress={() =>
        router.push({ pathname: "/photo", params: { photoUri: photo.uri } })
      }
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
