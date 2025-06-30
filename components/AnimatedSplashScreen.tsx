import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, { FadeOutDown, SlideInDown } from "react-native-reanimated";
import { Image } from "expo-image";
import { FONTS } from "utils/constants";
import CustomText from "./customText";

const AnimatedSplashScreen = () => {
  return (
    <Animated.View
      exiting={FadeOutDown}
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("assets/images/adaptiveIcon.png")}
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
          <CustomText variant="h1" fontFamily={"gilroyBold"}>
            Hungry?
          </CustomText>
        </Animated.View>
        <Animated.View entering={SlideInDown.duration(1000).delay(300)}>
          <CustomText variant="h5">Let Zesto handle it</CustomText>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default AnimatedSplashScreen;

const styles = StyleSheet.create({});
