import { View } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { COLORS, FONTS } from "utils/constants";
import { Image } from "expo-image";
import CustomText from "components/customText";
import Animated, { FadeOutDown, SlideInDown } from "react-native-reanimated";

import { useSharedState } from "context/sharedContext";
import { useDispatch } from "react-redux";
import { getUserInformation } from "utils/ApiManager";
import { setUser } from "redux/slice/userSlice";

const Main = () => {
  const { isSignedIn, userId, isLoaded } = useAuth();
  const { showSplashScreen, setShowSplashScreen } = useSharedState();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Is SignedIn ", isSignedIn);
  }, [isSignedIn]);

  const getUser = async () => {
    if (userId) {
      const userInformation = await getUserInformation(userId);
      dispatch(setUser(userInformation.user));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (isLoaded) {
        setShowSplashScreen(false);
      }
    }, 2000);
  }, [isLoaded]);

  useEffect(() => {
    if (isSignedIn) {
      getUser();
    }
  }, [isSignedIn]);

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
