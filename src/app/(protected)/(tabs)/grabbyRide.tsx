import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomText from "components/customText";

const GrabbyRide = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#0fb758" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CustomText variant="h2" fontFamily="gilroyThin" color="white">
          Gilroy Thin
        </CustomText>
        <CustomText variant="h2" fontFamily="gilroyLight" color="white">
          Gilroy Light
        </CustomText>
        <CustomText variant="h2" color="white">
          {" "}
          Gilroy Regular
        </CustomText>
        <CustomText variant="h2" fontFamily="gilroyMedium" color="white">
          Gilroy Medium
        </CustomText>
        <CustomText variant="h2" fontFamily="gilroySemiBold" color="white">
          Gilroy Semibold
        </CustomText>
        <CustomText variant="h2" fontFamily="gilroyBold" color="white">
          Gilroy Bold
        </CustomText>
        <CustomText variant="h2" fontFamily="gilroyExtraBold" color="white">
          Gilroy ExtraBold
        </CustomText>
      </View>
    </View>
  );
};

export default GrabbyRide;

const styles = StyleSheet.create({});
