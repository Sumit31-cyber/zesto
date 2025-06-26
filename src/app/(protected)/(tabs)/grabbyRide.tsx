import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import CustomText from "components/customText";
import { clearAllPersistedData } from "redux/store";
import LottieView from "lottie-react-native";
import { COLORS, screenHeight, screenWidth } from "utils/constants";
import { Image } from "expo-image";

const GrabbyRide = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          width: screenWidth,
          height: screenHeight * 0.3,
          backgroundColor: "#586376",
        }}
      >
        <LottieView
          autoPlay
          resizeMode="cover"
          style={{
            flex: 1,
          }}
          source={require("assets/animations/raining.json")}
        />

        <Image
          contentFit="cover"
          source={require("assets/images/cloud2.png")}
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ rotate: "180deg" }], opacity: 0.3 },
          ]}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => {
            clearAllPersistedData();
          }}
        >
          <CustomText variant="h1" fontFamily="gilroyExtraBold" color="red">
            Clear
          </CustomText>
        </TouchableOpacity>
        <CustomText variant="h2" fontFamily="gilroyThin" color="black">
          Gilroy Thin
        </CustomText>
        <CustomText variant="h2" fontFamily="gilroyLight" color="black">
          Gilroy Light
        </CustomText>
        <CustomText variant="h2" color="black">
          {" "}
          Gilroy Regular
        </CustomText>
        <CustomText variant="h2" fontFamily="gilroyMedium" color="black">
          Gilroy Medium
        </CustomText>
        <CustomText variant="h2" fontFamily="gilroySemiBold" color="black">
          Gilroy Semibold
        </CustomText>
        <CustomText variant="h2" fontFamily="gilroyBold" color="black">
          Gilroy Bold
        </CustomText>
        <CustomText variant="h2" fontFamily="gilroyExtraBold" color="black">
          Gilroy ExtraBold
        </CustomText>
      </View>
    </View>
  );
};

export default GrabbyRide;

const styles = StyleSheet.create({});
