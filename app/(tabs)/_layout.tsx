import { Tabs } from "expo-router";
import React from "react";
import { Pressable, View, Alert } from "react-native";
import { AntDesign, Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import tw from "twrnc";
import * as MediaLibrary from "expo-media-library";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { useSelectedItems } from "@/hooks/useSelectedItems";
import { usePhotos } from "@/hooks/usePhotos";

const TabsLayout = () => {
  const queryClient = useQueryClient();
  const { selectedAlbums, selectedPhotos, setSelectedPhotos } =
    useSelectedItems();
  const photos = usePhotos((state) => state.photos);

  const { mutate: handleDeleteSelectedPhotos, isPending } = useMutation({
    mutationKey: ["delete-selected-photos"],
    mutationFn: async () => {
      const tempAlbum = await MediaLibrary.createAlbumAsync(
        "temp",
        selectedPhotos[0],
        false
      );

      if (selectedPhotos.length > 1) {
        await MediaLibrary.addAssetsToAlbumAsync(
          selectedPhotos.slice(1),
          tempAlbum,
          false
        );
      }

      const isAlbumDeleted = await MediaLibrary.deleteAlbumsAsync(
        tempAlbum,
        true
      );
      if (!isAlbumDeleted) {
        throw new Error("Album not deleted");
      }

      return true;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-photos"] });
      await queryClient.invalidateQueries({ queryKey: ["get-album-photos"] });

      setSelectedPhotos([]);
    },
    onError: () => {
      Alert.alert("Error", "Some error occured");
    },
  });
  return (
    <Tabs>
      <Tabs.Screen
        name="photos"
        options={{
          title: "Photos",
          tabBarIcon: ({ color, size }) => {
            return <AntDesign name="picture" size={size} color={color} />;
          },
          headerRight: () => {
            return (
              <View style={tw`mr-3 flex-row gap-x-6 items-center`}>
                {selectedPhotos.length > 0 ? (
                  <>
                    <Pressable
                      onPress={() => {
                        setSelectedPhotos(photos);
                      }}
                    >
                      <Feather name="check-square" size={23} color="black" />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        Alert.alert(
                          "Warning",
                          "Do you want to delete these photos?",
                          [
                            {
                              text: "No",
                            },
                            {
                              text: "Yes",
                              onPress: () => handleDeleteSelectedPhotos(),
                            },
                          ]
                        );
                      }}
                      disabled={isPending}
                    >
                      <FontAwesome5 name="trash" size={21} color="black" />
                    </Pressable>
                  </>
                ) : (
                  <Feather name="settings" size={23} />
                )}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="albums"
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="albums" size={size} color={color} />;
          },
          title: "Albums",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
