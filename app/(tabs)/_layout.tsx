import { Tabs } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { AntDesign, Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import tw from "twrnc";

import { useSelectedItems } from "@/hooks/useSelectedItems";
import { usePhotos } from "@/hooks/usePhotos";

const TabsLayout = () => {
  const { selectedAlbums, selectedPhotos, setSelectedPhotos } =
    useSelectedItems();
  const photos = usePhotos((state) => state.photos);
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
                    <FontAwesome5 name="trash" size={21} color="black" />
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
