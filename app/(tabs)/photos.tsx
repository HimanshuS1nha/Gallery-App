import { View, Text } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import tw from "twrnc";

const Photos = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["get-photos"],
    queryFn: async () => {
      const albumAssets = await MediaLibrary.getAssetsAsync();
      return albumAssets.assets;
    },
  });
  return (
    <View style={tw`flex-1 bg-white`}>
      <Text>Photos</Text>
    </View>
  );
};

export default Photos;
