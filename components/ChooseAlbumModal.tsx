import { View, Text, Modal, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import { useAlbums } from "@/hooks/useAlbums";
import { useChooseAlbumModal } from "@/hooks/useChooseAlbumModal";

const ChooseAlbumModal = () => {
  const albums = useAlbums((state) => state.albums);
  const { isVisible, setIsVisible } = useChooseAlbumModal();
  return (
    <Modal animationType="slide" transparent visible={isVisible}>
      <View style={tw`flex-1 bg-gray-100/70`}>
        <View
          style={tw`absolute w-[90%] m-4 p-6 shadow shadow-black bg-white bottom-0 gap-y-5 rounded-xl`}
        >
          <Pressable
            style={tw`absolute right-2 top-2`}
            onPress={() => setIsVisible(false)}
          >
            <Ionicons name="close" size={23} color="black" />
          </Pressable>
          <Text style={tw`text-base font-medium`}>Choose an album</Text>

          <View style={tw`gap-y-3`}>
            {albums.map((album) => {
              return (
                <Pressable
                  key={album.id}
                  style={tw`p-2 rounded-full bg-gray-50 flex-row justify-between items-center rounded-full`}
                >
                  <Text style={tw`font-medium`}>{album.title}</Text>
                  <Text>{album.assetCount}</Text>
                </Pressable>
              );
            })}
            <Pressable
              style={tw`p-2 rounded-full bg-gray-50 flex-row justify-between items-center rounded-full`}
            >
              <Text style={tw`text-blue-600 font-medium`}>
                Create new album
              </Text>
              <AntDesign name="pluscircle" size={20} color="blue" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChooseAlbumModal;
