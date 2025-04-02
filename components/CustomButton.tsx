import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { COLORS } from "utils/constants";
import CustomText from "./customText";

type props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  showLoader?: boolean;
  loaderSize?: "large" | "small";
  loaderColor?: string;
};

const CustomButton = ({
  title,
  onPress,
  style,
  showLoader = false,
  loaderSize = "small",
  loaderColor = "black",
}: props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        {
          height: 50,
          width: "100%",
          backgroundColor: COLORS.primary,
          borderRadius: 14,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          borderCurve: "continuous",
        },
        style,
      ]}
    >
      {showLoader ? (
        <ActivityIndicator color={loaderColor} size={loaderSize} />
      ) : (
        <CustomText variant="h6" color={"white"} style={{ letterSpacing: 0.8 }}>
          {title}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
