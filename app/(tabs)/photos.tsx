import { View, ActivityIndicator, Text } from "react-native";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";

import PhotoPreview from "@/components/PhotoPreview";

import { usePhotos } from "@/hooks/usePhotos";

const Photos = () => {
  const { photos, setPhotos } = usePhotos();

  const { data, isLoading } = useQuery({
    queryKey: ["get-photos"],
    queryFn: async () => {
      const albumAssets = await MediaLibrary.getAssetsAsync();
      return albumAssets.assets;
    },
  });

  useEffect(() => {
    if (data) {
      setPhotos(data);
    }
  }, [data]);
  return (
    <View style={tw`flex-1 bg-white`}>
      {isLoading ? (
        <ActivityIndicator size={45} color={"blue"} style={tw`mt-2`} />
      ) : photos.length === 0 ? (
        <Text style={tw`text-rose-600 text-center mt-4 font-medium text-base`}>
          No images to show
        </Text>
      ) : (
        <FlashList
          data={photos}
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

export default Photos;
