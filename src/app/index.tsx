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
import AnimatedSplashScreen from "components/AnimatedSplashScreen";

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
    return <AnimatedSplashScreen />;
  }

  return <Redirect href={isSignedIn ? "/food" : "/signIn"} />;
};

export default Main;
