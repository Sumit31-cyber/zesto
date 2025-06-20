import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PADDING_HORIZONTAL, screenHeight } from "utils/constants";
import { RFValue } from "react-native-responsive-fontsize";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import CustomText from "./customText";

export const headerHeight = screenHeight * 0.06;
const CustomHeader = ({ title }: { title: string }) => {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: top,
        height: headerHeight + top,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: PADDING_HORIZONTAL,
        flexDirection: "row",
        gap: RFValue(8),
        backgroundColor: "white",
      }}
    >
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => router.back()}
        style={{
          aspectRatio: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AntDesign name="arrowleft" size={RFValue(16)} color="black" />
      </TouchableOpacity>
      <CustomText variant="h6">{title}</CustomText>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({});
