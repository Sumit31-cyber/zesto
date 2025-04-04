import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import {
  DineoutIcon,
  FavoriteIcon,
  FoodIcon,
  ReorderIcon,
} from "assets/svgs/svgs";
import LocationHeader from "components/LocationHeader";
import SearchBar from "components/SearchBar";
import { COLORS } from "utils/constants";
import Animated, {
  useAnimatedScrollHandler,
  withTiming,
} from "react-native-reanimated";
import { useSharedState } from "context/sharedContext";

const Food = () => {
  const { signOut } = useAuth();
  const [searchText, setSearchText] = useState<string>("");
  const fakeData = new Array(100).fill(0).map((_, index) => ({ id: index }));
  const { scrollY, scrollYGlobal } = useSharedState();

  const onScroll = useAnimatedScrollHandler((event) => {
    const currentScrollY = event.contentOffset.y;
    const isScrollingDown = currentScrollY > scrollYGlobal.value;
    if (currentScrollY < 200) return;
    scrollY.value = isScrollingDown ? withTiming(0) : withTiming(1);
    scrollYGlobal.value = currentScrollY;
  });

  const sectionListData = [
    {
      title: "Header",
      data: [{}],
      renderItem: () => {
        return (
          <View
            style={{
              height: 500,
              width: "100%",
              marginVertical: 10,
              backgroundColor: "red",
            }}
          ></View>
        );
      },
    },
    {
      title: "Second Header",
      data: [{}],
      renderItem: () => {
        return (
          <View
            style={{
              height: 500,
              width: "100%",
              marginVertical: 10,
              backgroundColor: "yellow",
            }}
          ></View>
        );
      },
    },
  ];

  return (
    <View style={{ backgroundColor: COLORS.primary, paddingHorizontal: 14 }}>
      <StatusBar barStyle={"light-content"} />
      <SafeAreaView>
        <Animated.ScrollView
          onScroll={onScroll}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          bounces={false}
          scrollEventThrottle={16}
          style={{ backgroundColor: COLORS.primary }}
        >
          <LocationHeader />

          <SearchBar
            value={searchText}
            onChangeText={(value) => {
              setSearchText(value);
            }}
            onClosePress={() => {
              setSearchText("");
            }}
          />

          <View style={{ gap: 10 }}>
            {fakeData.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    height: 100,
                    width: "100%",
                    backgroundColor: COLORS.black,
                  }}
                ></View>
              );
            })}
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Food;

const styles = StyleSheet.create({});
