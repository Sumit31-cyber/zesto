import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "utils/constants";

const FullScreenLoadingIndicator = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.grayBackgroundColor,
      }}
    >
      <ActivityIndicator size={"large"} color={COLORS.primary} />
    </View>
  );
};

export default FullScreenLoadingIndicator;

const styles = StyleSheet.create({});
