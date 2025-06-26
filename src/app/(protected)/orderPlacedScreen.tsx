import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import { COLORS, screenHeight, screenWidth } from "utils/constants";
import CustomText from "components/customText";
import { useSelector } from "react-redux";
import { selectUser } from "redux/slice/userSlice";
import { router, useFocusEffect } from "expo-router";
import { wait } from "utils/functions";
const OrderPlacedScreen = () => {
  const userInformation = useSelector(selectUser);
  //   const animationRef = useRef<LottieView>(null);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        gap: 10,
      }}
    >
      <LottieView
        // ref={animationRef}
        resizeMode="contain"
        loop={false}
        autoPlay
        speed={0.6}
        onAnimationFinish={() => {
          console.log("End");
          setTimeout(() => {
            router.back();
          }, 500);
        }}
        style={{
          width: screenWidth * 0.4,
          height: screenHeight * 0.2,
        }}
        source={require("assets/animations/confirm.json")}
      />
      <CustomText variant="h3" fontFamily="gilroyBold">
        Yah! Order Received
      </CustomText>
      <CustomText variant="h7">
        {userInformation?.addresses[0].addressLine1}{" "}
        {userInformation?.addresses[0].city}{" "}
        {userInformation?.addresses[0].state}{" "}
        {userInformation?.addresses[0].postalCode}{" "}
      </CustomText>
    </View>
  );
};

export default OrderPlacedScreen;

const styles = StyleSheet.create({});
