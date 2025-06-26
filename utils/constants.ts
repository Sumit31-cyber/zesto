import { Dimensions, Platform, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const BOTTOM_TAB_HEIGHT = RFValue(70);
export const screenHeight = Dimensions.get("screen").height;
export const screenWidth = Dimensions.get("screen").width;
export const isBannerHeight = screenHeight * 0.4;

export const COLORS = {
  primary: "#0fb758",
  gray: "#adb5bd",
  darkGray: "#7d8593",
  extraDarkGray: "#606773",
  liteGray: "#eceff2",
  black: "#141414",
  grayBackgroundColor: "#eceff2",
};

export const BORDER_WIDTH = StyleSheet.hairlineWidth * 2;
export const PADDING_HORIZONTAL = 14;

export enum FONTS {
  Regular = "gilroyRegular",
  Bold = "gilroyBold",
  Light = "gilroyLight",
  Semibold = "gilroySemiBold",
  Thin = "gilroyThin",
  ExtraBold = "gilroyExtraBold",
  Medium = "gilroyMedium",
}

export const lightColors = [
  "rgba(255,255,255,1)",
  "rgba(255,255,255,0.9)",
  "rgba(255,255,255,0.7)",
  "rgba(255,255,255,0.6)",
  "rgba(255,255,255,0.5)",
  "rgba(255,255,255,0.4)",
  "rgba(255,255,255,0.003)",
];

export const darkWeatherColors = [
  "rgba(54, 67, 92, 1)",
  "rgba(54, 67, 92, 0.9)",
  "rgba(54, 67, 92, 0.8)",
  "rgba(54, 67, 92, 0.2)",
  "rgba(54, 67, 92, 0.0)",
];

export const FONT_SIZE = {
  h1: Platform.OS === "ios" ? 22 : 24,
  h2: Platform.OS === "ios" ? 20 : 22,
  h3: Platform.OS === "ios" ? 18 : 20,
  h4: Platform.OS === "ios" ? 16 : 18,
  h5: Platform.OS === "ios" ? 14 : 16,
  h6: Platform.OS === "ios" ? 12 : 14,
  h7: Platform.OS === "ios" ? 10 : 12,
};
