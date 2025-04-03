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

const TabLayout = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ tabBarActiveTintColor: "#0fb758", headerShown: false }}
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

const CustomTabBar: FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { bottom } = useSafeAreaInsets();
  const tabs = [
    { route: "food", icon: FoodIcon, label: "Food" },
    { route: "dineout", icon: DineoutIcon, label: "Dine Out" },
    { route: "favorite", icon: FavoriteIcon, label: "Favorites" },
    { route: "reorder", icon: ReorderIcon, label: "Reorder" },
    { route: "grabbyRide", icon: ReorderIcon, label: "GrabbyRide" },
  ];

  const activeIndex = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withTiming((screenWidth / 5) * activeIndex.value) },
      ],
    };
  });

  return (
    <View
      style={{
        // height: screenHeight * 0.1,
        width: "100%",
        backgroundColor: "white",
        flexDirection: "row",
        paddingBottom: bottom + 10,
        paddingTop: bottom - 10,
      }}
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
            console.log(route.name);
            activeIndex.value = index;
            navigation.navigate(route.name);
          }
        };

        const iconColor = isFocused ? COLORS.primary : "black";
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
              <DineoutIcon size={23} tint={iconColor} />
            )}
            {route.name === "favorite" && (
              <FavoriteIcon size={26} tint={iconColor} />
            )}
            {route.name === "reorder" && (
              <ReorderIcon size={24} tint={iconColor} />
            )}
            {route.name === "grabbyRide" && (
              <View
                style={{
                  width: "60%",
                  height: 30,
                  backgroundColor: "#0fb758",
                  borderRadius: 100,
                }}
              ></View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

// const CustomTabBar = ({ insets, router }) => {
//   const tabs = [
//     { route: "food", icon: FoodIcon, label: "Food" },
//     { route: "dineout", icon: DineoutIcon, label: "Dine Out" },
//     { route: "favorite", icon: FavoriteIcon, label: "Favorites" },
//     { route: "reorder", icon: ReorderIcon, label: "Reorder" },
//   ];

//   return (
//     <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
//       {tabs.map((tab, index) => {
//         const Icon = tab.icon;
//         const isActive = router.pathname === `/(tabs)/${tab.route}`;

//         return (
//           <Pressable
//             key={index}
//             style={styles.tabItem}
//             onPress={() => router.push(`/(tabs)/${tab.route}`)}
//           >
//             <Icon size={24} tint={isActive ? "#0fb758" : "#999"} />
//             <Text
//               style={[
//                 styles.tabLabel,
//                 { color: isActive ? "#0fb758" : "#999" },
//               ]}
//             >
//               {tab.label}
//             </Text>
//           </Pressable>
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   tabBarContainer: {
//     flexDirection: "row",
//     height: 80,
//     backgroundColor: "white",
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     paddingHorizontal: 16,
//   },
//   tabItem: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 8,
//   },
//   tabLabel: {
//     fontSize: 12,
//     marginTop: 4,
//     fontWeight: "500",
//   },
// });
