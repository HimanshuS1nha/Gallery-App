import { router, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import tw from "twrnc";

import { usePhotos } from "@/hooks/usePhotos";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { setSelectedPhoto } = usePhotos();
  return (
    <QueryClientProvider client={queryClient}>
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
                  <FontAwesome5 name="trash" size={20} color="white" />
                  <FontAwesome5 name="info-circle" size={20} color="white" />
                </View>
              );
            },
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
