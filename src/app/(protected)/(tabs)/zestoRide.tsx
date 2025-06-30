import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  COLORS,
  PADDING_HORIZONTAL,
  screenHeight,
  screenWidth,
} from "utils/constants";
import Animated, {
  SlideInDown,
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { Image } from "expo-image";
import CustomText from "components/customText";
import LottieView from "lottie-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";

const ZestoRide = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const carTranslateY = useSharedValue(-screenHeight * 0.3);
  const carOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(50);

  useFocusEffect(
    React.useCallback(() => {
      carTranslateY.value = -screenHeight * 0.3;
      carOpacity.value = 0;
      textOpacity.value = 0;
      textTranslateY.value = 50;

      carOpacity.value = withTiming(1, { duration: 800 });
      carTranslateY.value = withTiming(-screenHeight * 0.2, {
        duration: 1200,
      });

      textOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
      textTranslateY.value = withDelay(400, withTiming(0, { duration: 800 }));

      setAnimationKey((prev) => prev + 1);
    }, [])
  );

  const carAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: carTranslateY.value }],
    opacity: carOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View style={{ backgroundColor: "#f1f1f1", flex: 1 }}>
      <Animated.View
        style={[
          {
            width: screenWidth,
            height: screenHeight * 0.7,
            alignItems: "center",
            justifyContent: "center",
          },
          carAnimatedStyle,
        ]}
      >
        <Image
          contentFit="cover"
          style={{
            width: "100%",
            height: "100%",
          }}
          source={require("assets/images/car2.jpeg")}
        />
      </Animated.View>

      <Animated.View
        style={[
          {
            alignItems: "center",
            top: -screenHeight * 0.2,
            marginTop: PADDING_HORIZONTAL,
            gap: 6,
          },
          textAnimatedStyle,
        ]}
      >
        <CustomText variant="h1" fontFamily="gilroyMedium">
          NEVER BE LATE AGAIN
        </CustomText>
        <CustomText variant="h1" style={{ opacity: 0.6 }}>
          WITH ZESTO RIDE!
        </CustomText>
        <LottieView
          key={animationKey} // This forces the Lottie animation to restart
          autoPlay
          loop={true}
          resizeMode="contain"
          style={{
            height: RFValue(200),
            width: screenWidth,
          }}
          source={require("assets/animations/comingsoon.json")}
        />
      </Animated.View>
    </View>
  );
};

export default ZestoRide;

const styles = StyleSheet.create({});
