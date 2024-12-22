import { View, ActivityIndicator, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";
import { useIsFocused } from "@react-navigation/native";

import PhotoPreview from "@/components/PhotoPreview";

import { usePhotos } from "@/hooks/usePhotos";

const Photos = () => {
  const { photos, setPhotos } = usePhotos();
  const isFocused = useIsFocused();

  const [endCursor, setEndCursor] = useState<string>();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get-photos"],
    queryFn: async () => {
      const albumAssets = await MediaLibrary.getAssetsAsync({
        after: endCursor,
      });

      return { assets: albumAssets.assets, endCursor: albumAssets.endCursor };
    },
  });
  if (error) {
    Alert.alert("Error", "Some error occured");
  }

  useEffect(() => {
    if (data && data.assets.length !== photos.length) {
      setPhotos([...photos, ...data.assets]);
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
          onEndReached={refetch}
        />
      )}
    </View>
  );
};

export default Photos;
