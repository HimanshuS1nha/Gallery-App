import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import React, { useCallback } from "react";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import { useAlbums } from "@/hooks/useAlbums";
import { useSelectedItems } from "@/hooks/useSelectedItems";

const AlbumPreview = ({ album }: { album: MediaLibrary.Album }) => {
  const setSelectedAlbum = useAlbums((state) => state.setSelectedAlbum);
  const { selectedAlbums, setSelectedAlbums } = useSelectedItems();

  const { data, isLoading, error } = useQuery({
    queryKey: [`get-album-image-${album.id}`],
    queryFn: async () => {
      const albumAssets = await MediaLibrary.getAssetsAsync({
        album,
      });

      return albumAssets.assets[0].uri;
    },
  });
  if (error) {
    Alert.alert("Error", "Some error occured");
  }

  const checkIfAlbumIsSelected = useCallback(() => {
    let isAlbumSelected = false;

    selectedAlbums.map((selectedAlbum) => {
      if (selectedAlbum.id === album.id) {
        isAlbumSelected = true;
      }
    });

    return isAlbumSelected;
  }, [selectedAlbums, album]);
  return (
    <Pressable
      style={tw`gap-y-2 mb-4`}
      onPress={() => {
        if (isLoading) {
          return;
        }

        if (selectedAlbums.length > 0) {
          if (checkIfAlbumIsSelected()) {
            const newSelectedAlbums = selectedAlbums.filter(
              (selectedAlbum) => selectedAlbum.id !== album.id
            );
            setSelectedAlbums(newSelectedAlbums);
          } else {
            const newSelectedAlbums = [...selectedAlbums, album];
            setSelectedAlbums(newSelectedAlbums);
          }
        } else {
          setSelectedAlbum(album);
          router.push("/album-photos");
        }
      }}
      onLongPress={() => {
        if (!checkIfAlbumIsSelected()) {
          const newSelectedAlbums = [...selectedAlbums, album];
          setSelectedAlbums(newSelectedAlbums);
        }
      }}
    >
      {isLoading ? (
        <View
          style={tw`w-28 h-28 rounded-md items-center justify-center bg-gray-500`}
        >
          <ActivityIndicator color={"blue"} size={28} />
        </View>
      ) : (
        <>
          {data && (
            <View style={tw`w-28 h-28 rounded-md`}>
              <Image
                source={{ uri: data }}
                style={tw`w-full h-full rounded-md`}
                resizeMode="stretch"
              />
              {selectedAlbums.length !== 0 && checkIfAlbumIsSelected() && (
                <View
                  style={tw`absolute w-full h-full justify-center items-center bg-gray-100/70`}
                >
                  <AntDesign name="check" size={30} color="black" />
                </View>
              )}
            </View>
          )}
        </>
      )}

      <View>
        <Text style={tw` font-medium`}>{album.title}</Text>
        <Text style={tw`text-gray-500`}>{album.assetCount}</Text>
      </View>
    </Pressable>
  );
};

export default AlbumPreview;
