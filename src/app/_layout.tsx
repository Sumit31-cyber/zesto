import { Redirect, Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "src/providers/AuthProvider";
export default function RootLayout() {
  const { isAuthenticated } = useAuth();
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

  if (isAuthenticated === undefined) {
    return <Redirect href="/(protected)" />;
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
