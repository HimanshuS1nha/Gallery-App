import { router, useRootNavigationState } from "expo-router";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Image,
  Linking,
  View,
} from "react-native";
import tw from "twrnc";
import * as MediaLibrary from "expo-media-library";

export default function Index() {
  const rootNavigationState = useRootNavigationState();

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const getPermission = useCallback(async () => {
    if (permissionResponse?.status !== "granted") {
      await requestPermission();
    }
  }, []);

  useEffect(() => {
    if (rootNavigationState?.key) {
      if (permissionResponse) {
        getPermission().then(() => {
          router.replace("/photos");
        });
      }
    }
  }, [rootNavigationState?.key, permissionResponse?.status]);
  return (
    <View style={tw`flex-1 justify-center items-center gap-y-5 bg-white`}>
      <Image
        source={require("../assets/images/logo.png")}
        style={tw`w-54 h-54`}
      />
      <ActivityIndicator size={45} color={"blue"} />
    </View>
  );
}
