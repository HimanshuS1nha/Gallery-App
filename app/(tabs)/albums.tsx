import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";

import AlbumPreview from "@/components/AlbumPreview";

import { useAlbums } from "@/hooks/useAlbums";

const Albums = () => {
  const { albums, setAlbums } = useAlbums();

  const { data, isLoading } = useQuery({
    queryKey: ["get-albums"],
    queryFn: async () => {
      const albums = await MediaLibrary.getAlbumsAsync();
      return albums;
    },
  });

  useEffect(() => {
    if (data) {
      setAlbums(data);
    }
  }, [data]);
  return (
    <View style={tw`flex-1 bg-white pt-4 px-3`}>
      {isLoading ? (
        <ActivityIndicator size={45} color={"blue"} style={tw`mt-2`} />
      ) : (
        <FlashList
          data={albums}
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
