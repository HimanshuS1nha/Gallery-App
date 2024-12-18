import { View, Text, Image } from "react-native";
import React from "react";
import tw from "twrnc";
import { useLocalSearchParams } from "expo-router";

const Photo = () => {
  const { photoUri } = useLocalSearchParams() as { photoUri: string };
  return (
    <View style={tw`flex-1 bg-black`}>
      <Image
        source={{ uri: photoUri }}
        style={tw`w-full h-[60%] mt-[25%]`}
        resizeMode="stretch"
      />
    </View>
  );
};

export default Photo;
