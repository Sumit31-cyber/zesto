import {
  FlatList,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  BOTTOM_TAB_HEIGHT,
  COLORS,
  PADDING_HORIZONTAL,
  screenHeight,
  screenWidth,
} from "utils/constants";
import LocationHeader from "components/LocationHeader";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "components/SearchBar";
import { Image, ImageBackground } from "expo-image";
import { useSharedState } from "context/sharedContext";
import LottieView from "lottie-react-native";
import Divider from "components/Divider";
import CustomText from "components/customText";
import LimelightRestaurantCarousal from "components/LimelightRestaurantCarousal";
import SectionHeader from "components/SectionHeader";
import { RFValue } from "react-native-responsive-fontsize";
import { dineOutRestaurantsList, restaurantType } from "utils/dataObject";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { headerHeight } from "./favorite";

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const DineOut = () => {
  const { top } = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [locationSectionHeight, setLocationSectionHeight] = useState(0);
  const { scrollY, scrollYGlobal } = useSharedState();
  const [changeTextColor, setChangeTextColor] = useState(false);

  const shouldChangeState = useDerivedValue(() => {
    return scrollYGlobal.value > 10;
  });

  // React to changes
  useAnimatedReaction(
    () => shouldChangeState.value,
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setChangeTextColor)(current);
      }
    }
  );

  const clampedValue = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // "worklet";
      const currentScrollY = event.contentOffset.y;
      const diff = currentScrollY - scrollYGlobal.value;

      clampedValue.value = Math.min(
        Math.max(clampedValue.value + diff, 0),
        locationSectionHeight
      );

      const isScrollingDown = currentScrollY > scrollYGlobal.value;

      // Handle text color change
      // runOnJS(setChangeTextColor)(currentScrollY < 10);

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
      [0, (locationSectionHeight + top) / 2],
      [0, 1]
    );

    return {
      transform: [{ translateY: -clampedValue.value }],
      backgroundColor: `rgba(252, 252, 252,${bg})`,
    };
  });
  const rOpacity = useAnimatedStyle(() => {
    const bg = interpolate(
      scrollYGlobal.value,
      [0, (locationSectionHeight + top) / 2],
      [0, 1]
    );

    return {
      backgroundColor: `rgba(252, 252, 252,${bg})`,
    };
  });

  const sectionListData = [
    {
      id: 0,
      title: "Header",
      data: [{}],
      renderItem: () => <HeaderSection />,
    },
    {
      id: 1,
      title: "In the limelight",
      data: [{}],
      renderItem: () => <LimelightRestaurantCarousal />,
    },
    {
      id: 3,
      title: "What are you looking for",
      data: [{}],
      renderItem: () => <RestaurantTypeSection />,
    },
    {
      id: 4,
      title: "Popular restaurants around you",
      data: [{}],
      renderItem: () => <FeaturedRestaurantsSection />,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar
        animated={true}
        barStyle={changeTextColor ? "dark-content" : "light-content"}
      />
      <Animated.View
        onLayout={(event) => {
          setHeaderHeight(event.nativeEvent.layout.height);
        }}
        style={[
          absoluteHeaderStyle,
          {
            paddingTop: top,
            paddingHorizontal: PADDING_HORIZONTAL,
            position: "absolute",
            zIndex: 1,
            width: "100%",
          },
        ]}
      >
        <View
          onLayout={(event) => {
            setLocationSectionHeight(event.nativeEvent.layout.height);
          }}
        >
          <LocationHeader
            locationTextStyle={{
              color: changeTextColor ? "black" : "white",
            }}
            titleStyle={{ color: changeTextColor ? "black" : "white" }}
            iconColor={changeTextColor ? "black" : "white"}
          />
        </View>
        <SearchBar
          value={""}
          onChangeText={(value) => {
            console.log(value);
          }}
          onClosePress={() => {}}
        />
      </Animated.View>
      <Animated.View
        style={[
          rOpacity,
          {
            height: top,
            width: "100%",
            position: "absolute",
            zIndex: 200,
          },
        ]}
      ></Animated.View>

      <AnimatedSectionList
        contentContainerStyle={{
          paddingBottom: BOTTOM_TAB_HEIGHT + RFValue(50),
          backgroundColor: "white",
        }}
        overScrollMode={"always"}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        sections={sectionListData}
        bounces={false}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default DineOut;

const styles = StyleSheet.create({});

const RestaurantTypeSection = () => {
  const COLUMNS = 3;
  const GAP = PADDING_HORIZONTAL;

  return (
    <>
      <SectionHeader title="What are you looking for" />
      <FlatList
        data={restaurantType.slice(0, 6)}
        keyExtractor={(item) => item.id.toString()}
        numColumns={COLUMNS}
        columnWrapperStyle={{
          marginBottom: GAP,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              marginLeft: GAP,
              height: screenHeight * 0.2, // Square items
              maxWidth: (screenWidth - (COLUMNS + 1) * GAP) / COLUMNS,
              overflow: "hidden",
            }}
          >
            <View
              style={[
                StyleSheet.absoluteFill,
                { zIndex: 100, borderRadius: 8, overflow: "hidden" },
              ]}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.9)"]}
                style={{
                  marginTop: "auto",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CustomText
                  variant="h7"
                  fontFamily="gilroySemiBold"
                  color="white"
                  style={{ paddingVertical: RFValue(15) }}
                >
                  {item.type}
                </CustomText>
              </LinearGradient>
            </View>
            <Image
              style={{
                flex: 1,
                borderRadius: 8,
              }}
              source={item.image}
            />
          </View>
        )}
      />
    </>
  );
};

const HeaderSection = () => {
  return (
    <ImageBackground
      onTouchEnd={() => {}}
      source={{
        uri: "https://images.unsplash.com/photo-1624735793547-3b38a04fa422?q=80&w=3637&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }}
      style={{
        height: screenHeight * 0.45,
        width: "100%",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          paddingTop: headerHeight,
          flex: 1,
          alignItems: "center",
        }}
      >
        <LottieView
          autoPlay
          resizeMode="contain"
          speed={0.3}
          style={{
            width: screenWidth * 0.4,
            height: screenHeight * 0.2,
          }}
          source={require("assets/offerAnimation.json")}
        />
      </View>
    </ImageBackground>
  );
};
const FeaturedRestaurantsSection = () => {
  return (
    <>
      <SectionHeader title="Popular restaurants around you" />

      <View
        style={{
          gap: PADDING_HORIZONTAL,
          paddingHorizontal: PADDING_HORIZONTAL,
        }}
      >
        {dineOutRestaurantsList.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                height: screenHeight * 0.38,
                width: "100%",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <View style={{ height: "100%", backgroundColor: "red" }}>
                <Image style={{ flex: 1 }} source={{ uri: item.image }} />
              </View>
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,1)"]}
                style={{
                  position: "absolute",
                  width: "100%",
                  bottom: 0,
                }}
              >
                <View style={{ padding: RFValue(10) }}>
                  <LinearGradient
                    colors={[
                      "rgba(15, 183, 88,0.9)",
                      "rgba(15, 183, 88,0.3)",
                      "rgba(0,0,0,0.2)",
                    ]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{
                      paddingVertical: RFValue(10),
                      paddingHorizontal: PADDING_HORIZONTAL,
                      borderTopLeftRadius: 12,
                    }}
                  >
                    <CustomText
                      variant="h7"
                      fontSize={RFValue(7)}
                      color="white"
                      style={{ textTransform: "uppercase" }}
                    >
                      Walk-in-offer
                    </CustomText>
                    <View style={{ flexDirection: "row" }}>
                      <CustomText
                        variant="h7"
                        fontSize={RFValue(7)}
                        color="white"
                        fontFamily="gilroyBold"
                      >
                        Flat 10% OFF{" "}
                      </CustomText>
                      <CustomText
                        variant="h7"
                        fontSize={RFValue(7)}
                        color="white"
                      >
                        + 2 more
                      </CustomText>
                    </View>
                  </LinearGradient>
                  <View
                    style={{
                      backgroundColor: "white",
                      paddingVertical: RFValue(10),
                      paddingHorizontal: PADDING_HORIZONTAL,
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                      borderTopRightRadius: 12,
                      gap: RFValue(2),
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <CustomText variant="h6" fontFamily="gilroyBold">
                        {item.name}
                      </CustomText>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            height: RFValue(14),
                            width: RFValue(14),
                            borderRadius: 20,
                            backgroundColor: COLORS.primary,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <AntDesign
                            name="star"
                            size={RFValue(10)}
                            color="white"
                          />
                        </View>
                        <CustomText variant="h7" fontFamily="gilroyBold">
                          {" "}
                          {item.rating}
                        </CustomText>
                      </View>
                    </View>
                    <CustomText
                      variant="h7"
                      fontSize={RFValue(7)}
                      style={{ opacity: 0.6 }}
                    >
                      {item.address}
                    </CustomText>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 5,
                        opacity: 0.6,
                      }}
                    >
                      <CustomText variant="h7" fontFamily="gilroyMedium">
                        North Indian
                      </CustomText>
                      <CustomText variant="h7" fontFamily="gilroyMedium">
                        {"\u2022"}
                      </CustomText>
                      <CustomText variant="h7" fontFamily="gilroyMedium">
                        Chinese
                      </CustomText>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          );
        })}
      </View>
    </>
  );
};
