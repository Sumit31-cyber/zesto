import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { COLORS, FONTS } from "utils/constants";
import Animated, { SlideInDown } from "react-native-reanimated";
import CustomText from "./customText";

const AnimatedSplashScreen = () => {
  return (
    <View
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
        transition={600}
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
    </View>
  );
};

export default AnimatedSplashScreen;

const styles = StyleSheet.create({});
