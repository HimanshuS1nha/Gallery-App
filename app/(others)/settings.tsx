import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";

const Settings = () => {
  return (
    <View style={tw`px-5 flex-1 bg-white pt-4`}>
      <Text style={tw`text-black text-lg font-medium`}>Gallery</Text>
      <Text>Version 1.0.0</Text>
    </View>
  );
};

export default Settings;
