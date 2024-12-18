import { View, ActivityIndicator } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import { FlashList } from "@shopify/flash-list";

import PhotoPreview from "@/components/PhotoPreview";

import { useAlbums } from "@/hooks/useAlbums";

const AlbumPhotos = () => {
  const { selectedAlbum } = useAlbums();

  const { data, isLoading } = useQuery({
    queryKey: ["get-photos"],
    queryFn: async () => {
      const albumAssets = await MediaLibrary.getAssetsAsync();
      return albumAssets.assets;
    },
  });
  return (
    <View style={tw`flex-1 bg-white`}>
      <Stack.Screen options={{ title: selectedAlbum?.title }} />

      {isLoading ? (
        <ActivityIndicator size={45} color={"blue"} style={tw`mt-2`} />
      ) : (
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
      )}
    </View>
  );
};

export default AlbumPhotos;
