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
import {
  BORDER_WIDTH,
  COLORS,
  screenHeight,
  screenWidth,
} from "utils/constants";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSharedState } from "context/sharedContext";
import { Image, ImageBackground } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomText from "components/customText";
import { OfferItem } from "types/types";
import OfferCarousel from "components/OfferCarousal";

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
      backgroundColor: `rgba(252,252,252,${bg})`,
    };
  });

  const sectionListData = [
    {
      title: "Header",
      data: [{ id: "1" }], // Add minimal data with unique IDs
      renderItem: () => <HeaderSection headerHeight={headerHeight} />,
    },
    {
      title: "Second Header",
      data: [{ id: "2" }],
      renderItem: () => <OfferCarousel />,
    },
  ];
  const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
  return (
    <View style={{ backgroundColor: "white" }}>
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
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        sections={sectionListData}
        keyExtractor={(item, index) => String(index)}
        // renderSectionHeader={({ section: { title } }) => (
        //   <Text style={{}}>{title}</Text>
        // )}
      />

      {/* <Animated.ScrollView
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
      >
        <LinearGradient
          colors={["#fdf9ed", "#faedcd", "#f4d893"]}
          style={{
            width: "100%",
            paddingTop: headerHeight,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: "auto",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <LottieView
              autoPlay
              resizeMode="cover"
              speed={0.3}
              style={{
                width: 180,
                height: 100,
                marginTop: "auto",
              }}
              source={require("assets/diwaliText.json")}
            />
            <LottieView
              autoPlay
              resizeMode="cover"
              speed={0.3}
              style={{
                width: 150,
                aspectRatio: 1,
                marginTop: "auto",
              }}
              source={require("assets/diwaliAnimation.json")}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
            }}
          >
            <View
              style={{
                // width: "100%",
                height: BORDER_WIDTH,
                backgroundColor: "#e3871d",
                flex: 1,
              }}
            ></View>
            <CustomText
              variant="h7"
              color={"#e3871d"}
              style={{ marginHorizontal: 10 }}
            >
              Up To 60% OFF
            </CustomText>
            <View
              style={{
                // width: "100%",
                height: BORDER_WIDTH,
                backgroundColor: "#e3871d",
                flex: 1,
              }}
            ></View>
          </View>
        </LinearGradient>

        <View style={{ gap: 10, paddingTop: headerHeight + top }}>
          {fakeData.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  height: 100,
                  width: "100%",
                  marginBottom: 10,
                }}
              ></View>
            );
          })}
        </View>
      </Animated.ScrollView> */}
      <SafeAreaView />
    </View>
  );
};

export default Food;

const styles = StyleSheet.create({});

const HeaderSection = ({ headerHeight }: { headerHeight: number }) => {
  return (
    <LinearGradient
      colors={["#fdf9ed", "#faedcd", "#f4d893"]}
      style={{
        width: "100%",
        paddingTop: headerHeight,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          marginTop: "auto",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <LottieView
          autoPlay
          resizeMode="cover"
          speed={0.3}
          style={{
            width: 180,
            height: 100,
            marginTop: "auto",
          }}
          source={require("assets/diwaliText.json")}
        />
        <LottieView
          autoPlay
          resizeMode="cover"
          speed={0.3}
          style={{
            width: 150,
            aspectRatio: 1,
            marginTop: "auto",
          }}
          source={require("assets/diwaliAnimation.json")}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            // width: "100%",
            height: BORDER_WIDTH,
            backgroundColor: "#e3871d",
            flex: 1,
            marginHorizontal: 20,
          }}
        ></View>
        <CustomText variant="h7" color={"#e3871d"}>
          Up To 60% OFF
        </CustomText>
        <View
          style={{
            // width: "100%",
            height: BORDER_WIDTH,
            backgroundColor: "#e3871d",
            flex: 1,
            marginHorizontal: 20,
          }}
        ></View>
      </View>
    </LinearGradient>
  );
};
