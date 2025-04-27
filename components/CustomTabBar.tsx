import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect } from "react";
import {
  DineoutIcon,
  FavoriteIcon,
  FoodIcon,
  ReorderIcon,
} from "assets/svgs/svgs";
import { BOTTOM_TAB_HEIGHT, COLORS, screenWidth } from "utils/constants";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSharedState } from "context/sharedContext";
import CartFloatingStack from "./CartFloatingStack";
import Dropdown from "./Dropdown";

const CustomTabBar: FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { bottom } = useSafeAreaInsets();
  const activeIndex = useSharedValue(0);
  const { scrollY } = useSharedState();
  // const clampedValue = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withTiming((screenWidth / 5) * activeIndex.value) },
      ],
    };
  });

  const transitionStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            scrollY.value === 1
              ? withTiming(0)
              : withTiming(BOTTOM_TAB_HEIGHT + bottom),
        },
      ],
    };
  });

  useEffect(() => {
    activeIndex.value = state.index;
  }, [state.index]);
  return (
    <>
      <Dropdown />
      <Animated.View
        style={[
          transitionStyle,
          {
            width: "100%",
            backgroundColor: "white",
            flexDirection: "row",
            paddingBottom: bottom + 10,
            paddingTop: bottom - 10,
            position: "absolute",
            bottom: 0,
            height: BOTTOM_TAB_HEIGHT,
          },
        ]}
      >
        <Animated.View
          style={[
            rStyle,
            {
              height: 4,
              width: screenWidth / 5,
              backgroundColor: COLORS.primary,
              position: "absolute",
              borderRadius: 100,
            },
          ]}
        ></Animated.View>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconColor = isFocused ? COLORS.black : COLORS.gray;
          return (
            <Pressable
              onPress={onPress}
              key={index}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {route.name === "food" && <FoodIcon size={28} tint={iconColor} />}
              {route.name === "dineout" && (
                <DineoutIcon size={28} tint={iconColor} />
              )}
              {route.name === "favorite" && (
                <FavoriteIcon size={24} tint={iconColor} />
              )}
              {route.name === "reorder" && (
                <ReorderIcon size={24} tint={iconColor} />
              )}
              {route.name === "grabbyRide" && (
                <View
                  style={{
                    width: "60%",
                    height: 30,
                    backgroundColor: iconColor,
                    borderRadius: 100,
                  }}
                ></View>
              )}
            </Pressable>
          );
        })}
      </Animated.View>
    </>
  );
};

export default CustomTabBar;
