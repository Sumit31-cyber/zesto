import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BORDER_WIDTH, COLORS } from "utils/constants";

const Divider = () => {
  return (
    <View
      style={{
        height: BORDER_WIDTH,
        backgroundColor: COLORS.liteGray,
        width: "100%",
      }}
    />
  );
};

export default Divider;
