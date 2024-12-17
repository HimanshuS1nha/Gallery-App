import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

const TabsLayout = () => {
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
                <Feather name="settings" size={23} />
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
