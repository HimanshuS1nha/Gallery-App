import { View, Text, Image, ActivityIndicator } from "react-native";
import React from "react";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";

const AlbumPreview = ({ album }: { album: MediaLibrary.Album }) => {
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
    <View style={tw`gap-y-2 mb-4`}>
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
    </View>
  );
};

export default AlbumPreview;
