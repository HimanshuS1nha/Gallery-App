import * as React from "react";
import { router, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { Alert, Pressable, View } from "react-native";
import tw from "twrnc";
import * as MediaLibrary from "expo-media-library";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { usePhotos } from "@/hooks/usePhotos";
import { useAlbums } from "@/hooks/useAlbums";
import { useSelectedItems } from "@/hooks/useSelectedItems";

const StackNavigator = () => {
  const queryClient = useQueryClient();
  const { setSelectedPhoto, selectedPhoto } = usePhotos();
  const { albumPhotos } = useAlbums();
  const { selectedPhotos, setSelectedPhotos } = useSelectedItems();

  const { mutate: handleDeletePhoto, isPending: deletePhotoPending } =
    useMutation({
      mutationKey: [`delete-photo-${selectedPhoto?.id}`],
      mutationFn: async () => {
        const tempAlbum = await MediaLibrary.createAlbumAsync(
          "tempAlbum",
          selectedPhoto!,
          false
        );
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
        router.dismissAll();
      },
      onError: () => {
        Alert.alert("Error", "Some error occured");
      },
    });

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

      setSelectedPhotos([]);
    },
    onError: () => {
      Alert.alert("Error", "Some error occured");
    },
  });
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          statusBarBackgroundColor: "#fff",
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          statusBarBackgroundColor: "#fff",
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="(others)/photo"
        options={{
          statusBarBackgroundColor: "#000",
          statusBarStyle: "light",
          headerStyle: { backgroundColor: "#000" },
          headerTitleStyle: { color: "#fff" },
          title: "",
          headerBackVisible: false,
          headerLeft: () => {
            return (
              <Pressable
                onPress={() => {
                  setSelectedPhoto(null);
                  router.back();
                }}
              >
                <Ionicons name="chevron-back" size={23} color="white" />
              </Pressable>
            );
          },
          headerRight: () => {
            return (
              <View style={tw`mr-1 flex-row gap-x-7 items-center`}>
                <Pressable
                  onPress={() => {
                    Alert.alert(
                      "Warning",
                      "Do you want to delete this photo?",
                      [
                        {
                          text: "No",
                        },
                        {
                          text: "Yes",
                          onPress: () => handleDeletePhoto(),
                        },
                      ]
                    );
                  }}
                  disabled={deletePhotoPending}
                >
                  <FontAwesome5 name="trash" size={20} color="white" />
                </Pressable>
                <FontAwesome5 name="info-circle" size={20} color="white" />
              </View>
            );
          },
        }}
      />
      <Stack.Screen
        name="(others)/album-photos"
        options={{
          statusBarBackgroundColor: "#fff",
          statusBarStyle: "dark",
          title: "",
          headerRight: () => {
            return (
              <View style={tw`mr-3 flex-row gap-x-6 items-center`}>
                {selectedPhotos.length > 0 && (
                  <>
                    <Pressable
                      onPress={() => {
                        setSelectedPhotos(albumPhotos);
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
                )}
              </View>
            );
          },
        }}
      />
    </Stack>
  );
};

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StackNavigator />
    </QueryClientProvider>
  );
}
