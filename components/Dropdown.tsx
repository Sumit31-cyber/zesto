import { StyleSheet, View } from "react-native";
import React from "react";
import DropDownItem from "./DropDownItem";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useSharedState } from "context/sharedContext";
import { BOTTOM_TAB_HEIGHT, screenHeight } from "utils/constants";

export const _marginBottom = screenHeight * 0.02;
export const _dropDownItemHeight = 80;
export const _dropDownItemMargin = 10;

const Dropdown = () => {
  const { carts } = useSelector((state: RootState) => state.cart);
  const { scrollY, expanded } = useSharedState();
  const stackTranslationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            scrollY.value === 1
              ? withTiming(0)
              : withTiming(BOTTOM_TAB_HEIGHT - 20),
        },
      ],
    };
  });

  const rBackdrop = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded.value ? 1 : 0),
    };
  });

  return (
    <Animated.View
      pointerEvents={"box-none"}
      style={[
        stackTranslationStyle,
        {
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          zIndex: 100,
          bottom: BOTTOM_TAB_HEIGHT,
          width: "100%",
          height: screenHeight,
        },
      ]}
    >
      <Animated.View
        onTouchEnd={() => (expanded.value = !expanded.value)}
        entering={FadeIn}
        style={[
          rBackdrop,
          StyleSheet.absoluteFill,
          {
            height: screenHeight,
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            flex: 1,
          },
        ]}
      />

      {carts.map((item, index) => {
        return (
          <React.Fragment key={index}>
            <DropDownItem
              item={item}
              index={index}
              dropdownItemLength={carts.length}
              expanded={expanded}
            />
          </React.Fragment>
        );
      })}
    </Animated.View>
  );
};

export default Dropdown;
