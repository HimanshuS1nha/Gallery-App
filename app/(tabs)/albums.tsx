import { View, ActivityIndicator, Text, Alert } from "react-native";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";

import AlbumPreview from "@/components/AlbumPreview";

import { useAlbums } from "@/hooks/useAlbums";

const Albums = () => {
  const { albums, setAlbums } = useAlbums();

  const filteredAlbums = albums.filter((album) => album.assetCount > 0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-albums"],
    queryFn: async () => {
      const albums = await MediaLibrary.getAlbumsAsync();
      return albums;
    },
  });
  if (error) {
    Alert.alert("Error", "Some error occured");
  }

  useEffect(() => {
    if (data) {
      setAlbums(data);
    }
  }, [data]);
  return (
    <View style={tw`flex-1 bg-white pt-4 px-3`}>
      {isLoading ? (
        <ActivityIndicator size={45} color={"blue"} style={tw`mt-2`} />
      ) : filteredAlbums.length === 0 ? (
        <Text style={tw`text-rose-600 text-center mt-4 font-medium text-base`}>
          No albums to show
        </Text>
      ) : (
        <FlashList
          data={filteredAlbums}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return <AlbumPreview album={item} />;
          }}
          numColumns={3}
          estimatedItemSize={50}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Albums;
