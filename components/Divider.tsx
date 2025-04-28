import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { BORDER_WIDTH, COLORS } from "utils/constants";

const Divider = ({ style }: { style?: ViewStyle }) => {
  return (
    <View
      style={{
        height: BORDER_WIDTH,
        backgroundColor: COLORS.gray,
        width: "100%",
        ...style,
      }}
    />
  );
};

export default Divider;
