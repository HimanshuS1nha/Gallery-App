import { router, Tabs } from "expo-router";
import React from "react";
import { Pressable, View, Alert } from "react-native";
import { AntDesign, Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import tw from "twrnc";
import * as MediaLibrary from "expo-media-library";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { useSelectedItems } from "@/hooks/useSelectedItems";
import { usePhotos } from "@/hooks/usePhotos";
import { useAlbums } from "@/hooks/useAlbums";

const TabsLayout = () => {
  const queryClient = useQueryClient();
  const {
    selectedAlbums,
    setSelectedAlbums,
    selectedPhotos,
    setSelectedPhotos,
  } = useSelectedItems();
  const photos = usePhotos((state) => state.photos);
  const albums = useAlbums((state) => state.albums);

  const {
    mutate: handleDeleteSelectedPhotos,
    isPending: deleteSelectedPhotosPending,
  } = useMutation({
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
      await queryClient.invalidateQueries({ queryKey: ["get-albums"] });

      setSelectedPhotos([]);
      setSelectedAlbums([]);
    },
    onError: () => {
      Alert.alert("Error", "Some error occured");
    },
  });

  const {
    mutate: handleDeleteSelectedAlbums,
    isPending: deleteSelectedAlbumsPending,
  } = useMutation({
    mutationKey: ["delete-selected-albums"],
    mutationFn: async () => {
      let selectedAlbumsAssets: MediaLibrary.Asset[] = [];

      for (const selectedAlbum of selectedAlbums) {
        const assets = await MediaLibrary.getAssetsAsync({
          album: selectedAlbum,
        });
        selectedAlbumsAssets.push(...assets.assets);
      }

      const tempAlbum = await MediaLibrary.createAlbumAsync(
        "tempAlbum",
        selectedAlbumsAssets[0],
        false
      );
      if (selectedAlbumsAssets.length > 1) {
        await MediaLibrary.addAssetsToAlbumAsync(
          selectedAlbumsAssets.slice(1),
          tempAlbum
        );
      }

      const isAlbumDeleted = await MediaLibrary.deleteAlbumsAsync(tempAlbum);
      if (!isAlbumDeleted) {
        throw new Error("Album not delete");
      }

      return true;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-photos"] });
      await queryClient.invalidateQueries({ queryKey: ["get-album-photos"] });
      await queryClient.invalidateQueries({ queryKey: ["get-albums"] });

      setSelectedPhotos([]);
      setSelectedAlbums([]);
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
          title: selectedPhotos.length > 0 ? "" : "Photos",
          tabBarIcon: ({ color, size }) => {
            return <AntDesign name="picture" size={size} color={color} />;
          },
          headerLeft: () => {
            return (
              <Pressable
                onPress={() => {
                  if (selectedPhotos.length > 0) {
                    setSelectedPhotos([]);
                  }
                }}
                style={tw`ml-3.5`}
              >
                {selectedPhotos.length > 0 && (
                  <Ionicons name="chevron-back" size={23} color="black" />
                )}
              </Pressable>
            );
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
                      disabled={deleteSelectedPhotosPending}
                    >
                      <FontAwesome5 name="trash" size={21} color="black" />
                    </Pressable>
                  </>
                ) : (
                  <Pressable onPress={() => router.push("/settings")}>
                    <Feather name="settings" size={23} />
                  </Pressable>
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
          headerRight: () => {
            return (
              <View style={tw`mr-3 flex-row gap-x-6 items-center`}>
                {selectedAlbums.length > 0 ? (
                  <>
                    <Pressable
                      onPress={() => {
                        setSelectedAlbums(albums);
                      }}
                    >
                      <Feather name="check-square" size={23} color="black" />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        Alert.alert(
                          "Warning",
                          "Do you want to delete these albums?",
                          [
                            {
                              text: "No",
                            },
                            {
                              text: "Yes",
                              onPress: () => handleDeleteSelectedAlbums(),
                            },
                          ]
                        );
                      }}
                      disabled={deleteSelectedAlbumsPending}
                    >
                      <FontAwesome5 name="trash" size={21} color="black" />
                    </Pressable>
                  </>
                ) : (
                  <Pressable onPress={() => router.push("/settings")}>
                    <Feather name="settings" size={23} />
                  </Pressable>
                )}
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
