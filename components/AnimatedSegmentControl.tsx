import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { COLORS, screenHeight } from "utils/constants";
import CustomText from "./customText";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const controllerData = ["Delivery Type", "Tip", "Instructions"];
const controllerHeight = screenHeight * 0.045;
const controllerBorderRadius = 100;

interface Props {
  activeIndex: number;
  onPress: (value: number) => void;
}
const AnimatedSegmentControl: React.FC<Props> = ({ activeIndex, onPress }) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming((activeIndex * containerWidth) / 3, {
            duration: 300,
          }),
        },
      ],
    };
  });
  return (
    <View
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width);
      }}
      style={{
        width: "100%",
        height: controllerHeight,
        backgroundColor: COLORS.liteGray,
        borderRadius: controllerBorderRadius,
        flexDirection: "row",
      }}
    >
      <Animated.View
        style={[
          rStyle,
          {
            position: "absolute",
            backgroundColor: "black",
            height: "100%",
            width: containerWidth / controllerData.length,
            borderRadius: controllerBorderRadius,
          },
        ]}
      ></Animated.View>
      {controllerData.map((item, index) => {
        return (
          <TouchableOpacity
            key={item}
            activeOpacity={0.8}
            onPress={() => {
              onPress(index);
            }}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <CustomText
              variant="h7"
              fontFamily="gilroySemiBold"
              color={activeIndex === index ? "white" : "black"}
            >
              {item}
            </CustomText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default AnimatedSegmentControl;

const styles = StyleSheet.create({});
