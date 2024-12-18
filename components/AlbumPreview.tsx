import { View, Text, Image, ActivityIndicator, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";

import { useAlbums } from "@/hooks/useAlbums";

const AlbumPreview = ({ album }: { album: MediaLibrary.Album }) => {
  const setSelectedAlbum = useAlbums((state) => state.setSelectedAlbum);

  const { data, isLoading } = useQuery({
    queryKey: [`get-album-image-${album.id}`],
    queryFn: async () => {
      const albumAssets = await MediaLibrary.getAssetsAsync({
        album,
      });

      return albumAssets.assets[0].uri;
    },
  });
  return (
    <Pressable
      style={tw`gap-y-2 mb-4`}
      onPress={() => {
        if (isLoading) {
          return;
        }

        setSelectedAlbum(album);
        router.push("/album-photos");
      }}
    >
      {isLoading ? (
        <View
          style={tw`w-28 h-28 rounded-md items-center justify-center bg-gray-500`}
        >
          <ActivityIndicator color={"blue"} size={28} />
        </View>
      ) : (
        <>
          {data && (
            <Image source={{ uri: data }} style={tw`w-28 h-28 rounded-md`} />
          )}
        </>
      )}

      <View>
        <Text style={tw` font-medium`}>{album.title}</Text>
        <Text style={tw`text-gray-500`}>{album.assetCount}</Text>
      </View>
    </Pressable>
  );
};

export default AlbumPreview;
