import { View } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { COLORS, FONTS } from "utils/constants";
import { Image } from "expo-image";
import CustomText from "components/customText";
import Animated, { FadeOutDown, SlideInDown } from "react-native-reanimated";

import { useSharedState } from "context/sharedContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Main = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { showSplashScreen, setShowSplashScreen } = useSharedState();

  useEffect(() => {
    console.log("Is SignedIn ", isSignedIn);
  }, [isSignedIn]);

  useEffect(() => {
    setTimeout(() => {
      if (isLoaded) {
        setShowSplashScreen(false);
      }
    }, 2000);
  }, [isLoaded]);

  if (showSplashScreen) {
    return (
      <Animated.View
        exiting={FadeOutDown}
        style={{
          flex: 1,
          backgroundColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("assets/images/adaptive-icon.png")}
          style={{ height: 300, aspectRatio: 1 }}
          transition={1000}
        />
        <View
          style={{
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Animated.View entering={SlideInDown.duration(1000)}>
            <CustomText variant="h1" fontFamily={FONTS.Bold} color="white">
              Hungry?
            </CustomText>
          </Animated.View>
          <Animated.View entering={SlideInDown.duration(1000).delay(300)}>
            <CustomText variant="h5" fontFamily={FONTS.Regular} color="white">
              Let Grabby handle it
            </CustomText>
          </Animated.View>
        </View>
      </Animated.View>
    );
  }

  return <Redirect href={isSignedIn ? "/food" : "/signIn"} />;
};

export default Main;
