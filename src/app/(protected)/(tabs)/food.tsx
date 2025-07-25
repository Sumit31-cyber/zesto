import {
  Pressable,
  SafeAreaView,
  ScrollView,
  SectionList,
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
import { BOTTOM_TAB_HEIGHT, COLORS } from "utils/constants";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSharedState } from "context/sharedContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OfferItem, SectionListDataProps } from "types/types";
import OfferCarousel from "components/OfferCarousal";
import HeaderSection from "components/HeaderSection";
import FoodTypeSection from "components/FoodTypeSection";
import FilterBar from "components/FilterBar";
import RecommendedRestaurantSection from "components/RecommendedRestaurantSection";
import { BlurView } from "expo-blur";

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const Food = () => {
  const { signOut } = useAuth();
  const [searchText, setSearchText] = useState<string>("");
  const [headerHeight, setHeaderHeight] = useState(0);
  const { scrollY, scrollYGlobal } = useSharedState();
  const { top } = useSafeAreaInsets();
  const clampedValue = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const diff = currentScrollY - scrollYGlobal.value;

      clampedValue.value = Math.min(
        Math.max(clampedValue.value + diff, 0),
        headerHeight
      );

      const isScrollingDown = currentScrollY > scrollYGlobal.value;

      if (currentScrollY < 200) {
        scrollYGlobal.value = currentScrollY;
        return;
      }
      scrollY.value = isScrollingDown ? withTiming(0) : withTiming(1);
      scrollYGlobal.value = currentScrollY;
    },
  });

  const absoluteHeaderStyle = useAnimatedStyle(() => {
    const bg = interpolate(
      scrollYGlobal.value,
      [0, (headerHeight + top) / 2],
      [0, 1]
    );

    return {
      transform: [{ translateY: -clampedValue.value }],
      // backgroundColor: `rgba(252, 252, 252,${bg})`,
    };
  });
  // const blurOpacity = useAnimatedStyle(() => {
  //   const opacity = interpolate(
  //     scrollYGlobal.value,
  //     [0, (headerHeight + top) / 2],
  //     [1, 1]
  //   );

  //   return {
  //     opacity,
  //     // backgroundColor: `rgba(252, 252, 252,${bg})`,
  //   };
  // });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollYGlobal.value,
        [0, (headerHeight + top) / 2],
        ["#9bcfa3", "#ffff"]
      ),
    };
  });

  const sectionListData = [
    {
      id: 0,
      title: "Header",
      data: [{}],
      renderItem: () => <HeaderSection headerHeight={headerHeight} />,
    },
    // {
    //   id: 1,
    //   title: "Offers",
    //   data: [{}],
    //   renderItem: () => <OfferCarousel />,
    // },
    {
      id: 3,
      title: "Sumit, What's on your mind?",
      data: [{}],
      renderItem: () => <FoodTypeSection />,
    },
    {
      id: 4,
      title: "Restaurant",
      data: [{}],
      renderItem: () => <RecommendedRestaurantSection />,
    },
  ];

  return (
    <AnimatedSafeAreaView style={[animatedStyle, { flex: 1 }]}>
      <StatusBar barStyle={"dark-content"} />

      <Animated.View
        onLayout={(event) => {
          setHeaderHeight(event.nativeEvent.layout.height);
        }}
        style={[
          absoluteHeaderStyle,
          {
            position: "absolute",
            width: "100%",
            paddingTop: top,
            paddingHorizontal: 14,
            zIndex: 100,
          },
        ]}
      >
        <AnimatedBlurView style={[StyleSheet.absoluteFill]} intensity={30} />
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
      </Animated.View>

      <AnimatedSectionList
        contentContainerStyle={{
          paddingBottom: BOTTOM_TAB_HEIGHT + 20,
          backgroundColor: "white",
        }}
        keyExtractor={(item, index) => index.toString()}
        overScrollMode={"always"}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        sections={sectionListData}
        bounces={false}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        // @ts-ignore
        renderSectionHeader={({ section: { title } }) => {
          if (title != "Restaurant") {
            return null;
          }
          return <FilterBar />;
        }}
      />
    </AnimatedSafeAreaView>
  );
};

export default Food;

const styles = StyleSheet.create({});
