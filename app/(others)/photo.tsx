import { View, Image } from "react-native";
import React from "react";
import tw from "twrnc";

import PhotoInfoModal from "@/components/PhotoInfoModal";

import { usePhotos } from "@/hooks/usePhotos";

const Photo = () => {
  const selectedPhoto = usePhotos((state) => state.selectedPhoto);
  return (
    <View style={tw`flex-1 bg-black`}>
      <PhotoInfoModal />
      <Image
        source={{ uri: selectedPhoto?.uri }}
        style={tw`w-full h-[60%] mt-[25%]`}
        resizeMode="stretch"
      />
    </View>
  );
};

export default Photo;
