import {
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import {
  BOTTOM_TAB_HEIGHT,
  COLORS,
  PADDING_HORIZONTAL,
  screenHeight,
} from "utils/constants";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  RecommendedRestaurantDataTypes,
  SectionListDataProps,
} from "types/types";
import CustomText from "components/customText";
import { Image } from "expo-image";
import { restaurantItemsData } from "utils/dataObject";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSharedState } from "context/sharedContext";
import { useSafeArea, useSafeAreaInsets } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
const _imageHeaderHeight = RFValue(220);
const RestaurantScreen = () => {
  const { restaurant } = useLocalSearchParams() as {
    restaurant: string; // Expo Router params can be string or string[]
  };

  //   const { restaurantScreenScrollY, restaurantScreenGlobalScrollY } =
  //     useSharedState();
  const restaurantScreenScrollY = useSharedValue(1);
  const restaurantScreenGlobalScrollY = useSharedValue(0);
  const { top } = useSafeAreaInsets();
  const restaurantData = JSON.parse(
    restaurant
  ) as RecommendedRestaurantDataTypes;
  const {
    address,
    discount,
    discountAmount,
    distance,
    id,
    imageUrl,
    name,
    time,
    rating,
  } = restaurantData;

  const [headerHeight, setHeaderHeight] = useState(0);

  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(restaurantScreenGlobalScrollY.value > 10 ? 1 : 0),
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      restaurantScreenGlobalScrollY.value = currentScrollY;
    },
  });

  const filterStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(
        restaurantScreenGlobalScrollY.value > headerHeight + top / 2 ? 1 : 0,
        { duration: 100 }
      ),
    };
  });
  const rFilter = useAnimatedStyle(() => {
    const ty = interpolate(
      restaurantScreenGlobalScrollY.value,
      [0, _imageHeaderHeight - headerHeight],
      [0, -(_imageHeaderHeight - headerHeight)],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY: ty }],
    };
  });

  const sectionListData: SectionListDataProps[] = [
    {
      id: 0,
      title: "Header",
      data: [{}],
      renderItem: () => <HeaderSection restaurantData={restaurantData} />,
    },
    {
      id: 2,
      title: "Main",
      data: [{}],
      renderItem: () => (
        <View>
          {restaurantItemsData.map(() => {
            return (
              <View
                style={{
                  height: 200,
                  width: "100%",
                  backgroundColor: "green",
                  marginBottom: 10,
                }}
              />
            );
          })}
        </View>
      ),
    },
  ];
  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        onLayout={(event) => {
          setHeaderHeight(event.nativeEvent.layout.height);
        }}
        style={[
          rStyle,
          {
            top: 0,
            position: "absolute",
            width: "100%",
            backgroundColor: "white",
            zIndex: 100,
            paddingVertical: RFValue(5),
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: top,
            paddingHorizontal: PADDING_HORIZONTAL,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              gap: 14,
              alignItems: "center",
            }}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <View style={{ gap: 5 }}>
              <CustomText variant="h5" numberOfLines={1} color={COLORS.black}>
                {name}
              </CustomText>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <CustomText variant="h7" color={COLORS.darkGray}>
                  {rating}
                </CustomText>
                <CustomText variant="h7" color={COLORS.darkGray}>
                  ({distance})
                </CustomText>
                <Text style={{ fontSize: RFValue(4), color: COLORS.darkGray }}>
                  {"\u2B24"}
                </Text>
                <CustomText variant="h7" color={COLORS.darkGray}>
                  {time}
                </CustomText>
              </View>
            </View>
          </View>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color={COLORS.black}
          />
        </View>
      </Animated.View>
      <Animated.View
        style={[
          rFilter,
          {
            height: 60,
            width: "100%",
            backgroundColor: "yellow",
            position: "absolute",
            top: _imageHeaderHeight,
            zIndex: 999,
          },
        ]}
      ></Animated.View>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={false}
      >
        <HeaderSection restaurantData={restaurantData} />

        <View style={{ paddingTop: 60 }}>
          {restaurantItemsData.map(() => {
            return (
              <View
                style={{
                  height: 200,
                  width: "100%",
                  backgroundColor: "green",
                  marginBottom: 10,
                }}
              />
            );
          })}
        </View>
      </Animated.ScrollView>
      {/* <AnimatedSectionList
        contentContainerStyle={{
          paddingBottom: BOTTOM_TAB_HEIGHT + 20,
          backgroundColor: "white",
        }}
        overScrollMode={"always"}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        sections={sectionListData}
        bounces={false}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        renderSectionHeader={({ section }) => {
          if (section.title != "Main") {
            return null;
          }
          return (
            <View
              style={{
                height: 50,
                width: "100%",
                backgroundColor: "yellow",
                paddingTop: 200,
              }}
            />
          );
        }}
      /> */}
    </View>
  );
};

export default RestaurantScreen;

const styles = StyleSheet.create({});

// const FilterSection = ({ style }: { style?: ViewStyle }) => {
//   return (
//     <Animated.View
//       style={[
//         style,
//         {
//           height: 60,
//           width: "100%",
//           backgroundColor: "red",
//           zIndex: 100,
//         },
//       ]}
//     ></Animated.View>
//   );
// };

const HeaderSection = ({
  restaurantData,
}: {
  restaurantData: RecommendedRestaurantDataTypes;
}) => {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        overflow: "hidden",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
      }}
    >
      <Image
        source={{ uri: restaurantData.imageUrl }}
        style={{
          height: _imageHeaderHeight,
          width: "100%",
        }}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(0,0,0,0.4)",
            paddingTop: top,
            paddingHorizontal: PADDING_HORIZONTAL,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color={"white"} />
          </TouchableOpacity>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="white"
          />
        </View>

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 14,
            marginTop: RFValue(40),
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ gap: 10 }}>
              <CustomText
                variant="h4"
                numberOfLines={1}
                fontFamily="aeonikBold"
              >
                {restaurantData.name}
              </CustomText>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <CustomText variant="h6" color={COLORS.black}>
                  {restaurantData.time}
                </CustomText>
                <Text style={{ fontSize: RFValue(4), color: COLORS.black }}>
                  {"\u2B24"}
                </Text>
                <CustomText variant="h6" color={COLORS.black}>
                  {restaurantData.distance}
                </CustomText>
              </View>
              <CustomText
                variant="h7"
                color={COLORS.darkGray}
                numberOfLines={2}
              >
                {restaurantData.address}
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: COLORS.primary,
                paddingVertical: 4,
                paddingHorizontal: 5,
                borderRadius: 5,
                gap: 5,
              }}
            >
              <AntDesign name="star" size={RFValue(10)} color="white" />
              <CustomText variant="h7" color={"white"}>
                {restaurantData.rating}
              </CustomText>
            </View>
            <CustomText variant="h7" color={COLORS.darkGray}>
              174 ratings
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );
};
