import { router, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, View } from "react-native";
import tw from "twrnc";
import * as MediaLibrary from "expo-media-library";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { usePhotos } from "@/hooks/usePhotos";

const queryClient = new QueryClient();

const StackNavigator = () => {
  const { setSelectedPhoto, selectedPhoto } = usePhotos();
  const queryClient = useQueryClient();

  const { mutate: handleDeleteImage, isPending } = useMutation({
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
        throw new Error("Album not deleted.");
      }

      return true;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-photos"] });
      router.dismissAll();
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
                          onPress: () => handleDeleteImage(),
                        },
                      ]
                    );
                  }}
                  disabled={isPending}
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
        }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  const { setSelectedPhoto } = usePhotos();
  return (
    <QueryClientProvider client={queryClient}>
      <StackNavigator />
    </QueryClientProvider>
  );
}
