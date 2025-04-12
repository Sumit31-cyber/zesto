import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ClerkProvider } from "@clerk/clerk-expo";
import { View } from "react-native";
import { SharedStateProvider } from "context/sharedContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
export default function RootLayout() {
  const [loaded] = useFonts({
    aeonikRegular: require("assets/fonts/AeonikRegular.otf"),
    aeonikBold: require("assets/fonts/AeonikBold.otf"),
    aeonikLight: require("assets/fonts/AeonikLight.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SharedStateProvider>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <Slot />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SharedStateProvider>
    </ClerkProvider>
  );
}
