import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { Tabs, useRouter, ScreenProps } from "expo-router";
import {
  DineoutIcon,
  FavoriteIcon,
  FoodIcon,
  ReorderIcon,
} from "assets/svgs/svgs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, screenHeight, screenWidth } from "utils/constants";
import { useNavigationState } from "@react-navigation/native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import CustomTabBar from "components/CustomTabBar";

const TabLayout = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="food"
        options={{
          tabBarIcon: ({ color }) => <FoodIcon size={28} tint={color} />,
        }}
      />
      <Tabs.Screen
        name="dineout"
        options={{
          tabBarIcon: ({ color }) => <DineoutIcon size={24} tint={color} />,
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          tabBarIcon: ({ color }) => <FavoriteIcon size={24} tint={color} />,
        }}
      />
      <Tabs.Screen
        name="reorder"
        options={{
          tabBarIcon: ({ color }) => <ReorderIcon size={24} tint={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
