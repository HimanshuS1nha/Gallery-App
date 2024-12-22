import {
  View,
  Text,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";

import { usePhotos } from "@/hooks/usePhotos";
import { usePhotoInfoModal } from "@/hooks/usePhotoInfoModal";
import { useQuery } from "@tanstack/react-query";

const PhotoInfoModal = () => {
  const { isVisible, setIsVisible } = usePhotoInfoModal();
  const selectedPhoto = usePhotos((state) => state.selectedPhoto);

  const { data, isLoading, error } = useQuery({
    queryKey: [`get-info-${selectedPhoto?.id}`],
    queryFn: async () => {
      const details = await MediaLibrary.getAssetInfoAsync(selectedPhoto!);

      return details;
    },
  });
  if (error) {
    Alert.alert("Error", "Some error occured");
  }
  return (
    <Modal animationType="slide" transparent visible={isVisible}>
      <View style={tw`flex-1 bg-gray-900/70`}>
        <View
          style={tw`absolute w-[90%] m-4 p-6 shadow shadow-black bg-white bottom-0 gap-y-5 rounded-xl`}
        >
          <Pressable
            style={tw`absolute right-2 top-2`}
            onPress={() => setIsVisible(false)}
          >
            <Ionicons name="close" size={23} color="black" />
          </Pressable>

          {isLoading ? (
            <ActivityIndicator color={"blue"} size={20} />
          ) : (
            data && (
              <View style={tw`gap-y-5 items-center mt-4`}>
                <View style={tw`flex-row justify-between items-center w-[95%]`}>
                  <Text>Filename</Text>
                  <Text style={tw`font-medium`}>
                    {data.filename.length > 25
                      ? data.filename.substring(0, 25) + "..."
                      : data.filename}
                  </Text>
                </View>
                <View style={tw`flex-row justify-between items-center w-[95%]`}>
                  <Text>Date</Text>
                  <Text style={tw`font-medium`}>
                    {new Date(data.modificationTime).toLocaleDateString()}
                  </Text>
                </View>
                <View style={tw`flex-row justify-between items-center w-[95%]`}>
                  <Text>Dimensions</Text>
                  <Text style={tw`font-medium`}>
                    {data.width} X {data.height}
                  </Text>
                </View>
              </View>
            )
          )}
        </View>
      </View>
    </Modal>
  );
};

export default PhotoInfoModal;
