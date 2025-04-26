import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import Divider from "./Divider";
import CustomText from "./customText";
import { COLORS } from "utils/constants";

const SectionHeader = ({
  title,
  style,
}: {
  title: string;
  style?: ViewStyle;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginVertical: 20,
        ...style,
      }}
    >
      <View style={{ flex: 1 }}>
        <Divider />
      </View>
      <CustomText
        variant="h7"
        color={COLORS.black}
        fontFamily="gilroyMedium"
        style={{ textTransform: "uppercase", letterSpacing: 1.2 }}
      >
        {title}
      </CustomText>
      <View style={{ flex: 1 }}>
        <Divider />
      </View>
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({});
