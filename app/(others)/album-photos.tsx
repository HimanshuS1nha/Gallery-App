import { View, ActivityIndicator, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import { FlashList } from "@shopify/flash-list";
import { useIsFocused } from "@react-navigation/native";

import PhotoPreview from "@/components/PhotoPreview";

import { useAlbums } from "@/hooks/useAlbums";
import { useSelectedItems } from "@/hooks/useSelectedItems";
import ChooseAlbumModal from "@/components/ChooseAlbumModal";
import CreateAlbumModal from "@/components/CreateAlbumModal";

const AlbumPhotos = () => {
  const { selectedAlbum, setAlbumPhotos, albumPhotos } = useAlbums();
  const selectedPhotos = useSelectedItems((state) => state.selectedPhotos);
  const isFocused = useIsFocused();

  const [endCursor, setEndCursor] = useState<string>();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get-album-photos"],
    queryFn: async () => {
      if (!selectedAlbum) {
        return null;
      }
      const albumAssets = await MediaLibrary.getAssetsAsync({
        album: selectedAlbum,
        after: endCursor,
      });
      return { assets: albumAssets.assets, endCursor: albumAssets.endCursor };
    },
  });
  if (error) {
    Alert.alert("Error", "Some error occured");
  }

  useEffect(() => {
    if (data && data.assets.length !== albumPhotos.length) {
      setAlbumPhotos([...albumPhotos, ...data.assets]);
      setEndCursor(data.endCursor);
    }
  }, [data]);

  useEffect(() => {
    if (!isFocused) {
      setEndCursor(undefined);
    }
  }, [isFocused]);
  return (
    <View style={tw`flex-1 bg-white`}>
      <Stack.Screen
        options={{
          title: selectedPhotos.length > 0 ? "" : selectedAlbum?.title,
        }}
      />

      <ChooseAlbumModal />
      <CreateAlbumModal />

      {isLoading ? (
        <ActivityIndicator size={45} color={"blue"} style={tw`mt-2`} />
      ) : albumPhotos.length === 0 ? (
        <Text style={tw`text-rose-600 text-center mt-4 font-medium text-base`}>
          No images to show
        </Text>
      ) : (
        <FlashList
          data={albumPhotos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return <PhotoPreview photo={item} />;
          }}
          numColumns={4}
          estimatedItemSize={50}
          showsVerticalScrollIndicator={false}
          onEndReached={refetch}
        />
      )}
    </View>
  );
};

export default AlbumPhotos;
