import { View, ActivityIndicator } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";

import AlbumPreview from "@/components/AlbumPreview";

const Albums = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["get-albums"],
    queryFn: async () => {
      const albums = await MediaLibrary.getAlbumsAsync();
      return albums;
    },
  });
  return (
    <View style={tw`flex-1 bg-white pt-4 px-3`}>
      {isLoading ? (
        <ActivityIndicator size={45} color={"blue"} style={tw`mt-2`} />
      ) : (
        <FlashList
          data={data}
          keyExtractor={(item, i) => i.toString()}
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
