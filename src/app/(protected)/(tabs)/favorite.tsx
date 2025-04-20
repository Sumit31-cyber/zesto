import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FONTS } from "utils/constants";
import CustomText from "components/customText";

const Favorite = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CustomText variant="h2" fontFamily="gilroyThin">
        Gilroy Thin
      </CustomText>
      <CustomText variant="h2" fontFamily="gilroyLight">
        Gilroy Light
      </CustomText>
      <CustomText variant="h2"> Gilroy Regular</CustomText>
      <CustomText variant="h2" fontFamily="gilroyMedium">
        Gilroy Medium
      </CustomText>
      <CustomText variant="h2" fontFamily="gilroySemiBold">
        Gilroy Semibold
      </CustomText>
      <CustomText variant="h2" fontFamily="gilroyBold">
        Gilroy Bold
      </CustomText>
      <CustomText variant="h2" fontFamily="gilroyExtraBold">
        Gilroy ExtraBold
      </CustomText>
    </View>
  );
};

export default Favorite;

const styles = StyleSheet.create({});
