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
import { Provider } from "react-redux";
import { store } from "redux/store";
export default function RootLayout() {
  const [loaded] = useFonts({
    aeonikRegular: require("assets/fonts/AeonikRegular.otf"),
    aeonikBold: require("assets/fonts/AeonikBold.otf"),
    aeonikLight: require("assets/fonts/AeonikLight.otf"),

    gilroyBlack: require("assets/fonts/GilroyBlack.ttf"),
    gilroyBold: require("assets/fonts/GilroyBold.ttf"),
    gilroyExtraBold: require("assets/fonts/GilroyExtraBold.ttf"),
    gilroyHeavy: require("assets/fonts/GilroyHeavy.ttf"),
    gilroyLight: require("assets/fonts/GilroyLight.ttf"),
    gilroyMedium: require("assets/fonts/GilroyMedium.ttf"),
    gilroyRegular: require("assets/fonts/GilroyRegular.ttf"),
    gilroySemiBold: require("assets/fonts/GilroySemiBold.ttf"),
    gilroyThin: require("assets/fonts/GilroyThin.ttf"),
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
    <Provider store={store}>
      <ClerkProvider tokenCache={tokenCache}>
        <SharedStateProvider>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <Slot />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SharedStateProvider>
      </ClerkProvider>
    </Provider>
  );
}
