import { View, ActivityIndicator } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";
import PhotoPreview from "@/components/PhotoPreview";

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
      {isLoading ? (
        <ActivityIndicator size={45} color={"blue"} style={tw`mt-2`} />
      ) : (
        <View style={tw`w-full h-full`}>
          <FlashList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <PhotoPreview photo={item} />;
            }}
            numColumns={4}
            estimatedItemSize={50}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

export default Photos;
