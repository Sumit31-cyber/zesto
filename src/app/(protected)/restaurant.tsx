import {
  ActivityIndicator,
  Alert,
  Button,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import { BORDER_WIDTH, COLORS, PADDING_HORIZONTAL } from "utils/constants";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  RecommendedRestaurantDataTypes,
  Restaurant,
  RestaurantDetail,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";
import RestaurantFoodItem from "components/RestaurantFoodItem";
import FilterBar from "components/FilterBar";
import CustomizableModal from "components/CustomizableModal";
import { useQuery } from "@tanstack/react-query";
import { getRestaurantDetail } from "utils/ApiManager";

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
const _imageHeaderHeight = RFValue(220);

const RestaurantScreen = () => {
  const { restaurantId } = useLocalSearchParams() as {
    restaurantId: string;
  };

  const { data, isLoading, error, isError } = useQuery<RestaurantDetail>({
    queryKey: ["restaurant_details", restaurantId], // Include restaurantId in query key
    queryFn: () => getRestaurantDetail(restaurantId), // Add return statement
    enabled: !!restaurantId, // Only run query if restaurantId exists
  });

  const restaurantScreenGlobalScrollY = useSharedValue(0);
  const { top } = useSafeAreaInsets();

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

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }
  if (!data) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <CustomText variant="h6">
          Restaurant with ID {restaurantId} not found
        </CustomText>
        <Button title="Go back" onPress={() => router.back()}></Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <CustomizableModal restaurant={data} />
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
              <CustomText
                variant="h6"
                numberOfLines={1}
                fontFamily="gilroySemiBold"
                color={COLORS.black}
              >
                {data.name}
              </CustomText>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <CustomText
                  variant="h7"
                  color={COLORS.darkGray}
                  fontFamily="gilroyMedium"
                >
                  {4.5}
                </CustomText>
                <CustomText
                  variant="h7"
                  color={COLORS.darkGray}
                  fontFamily="gilroyMedium"
                >
                  (12km)
                </CustomText>
                <Text style={{ fontSize: RFValue(4), color: COLORS.darkGray }}>
                  {"\u2B24"}
                </Text>
                <CustomText
                  variant="h7"
                  color={COLORS.darkGray}
                  fontFamily="gilroyMedium"
                >
                  {data.estimatedDeliveryTime}min
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
            width: "100%",
            // backgroundColor: "yellow",
            position: "absolute",
            top: _imageHeaderHeight,
            zIndex: 999,
          },
        ]}
      >
        <FilterBar />
        <View
          style={{
            height: BORDER_WIDTH * 2,
            width: "100%",
            backgroundColor: COLORS.liteGray,
            opacity: 0.3,
          }}
        ></View>
      </Animated.View>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={false}
        contentContainerStyle={{ backgroundColor: "white" }}
      >
        <HeaderSection restaurantData={data} />

        <View
          style={{
            marginTop: 60,
            gap: 5,
            paddingHorizontal: PADDING_HORIZONTAL,
          }}
        >
          {data.menuItems.map((item, index) => {
            return (
              <RestaurantFoodItem
                key={index}
                item={item}
                index={index}
                restaurant={data}
              />
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default RestaurantScreen;

const styles = StyleSheet.create({});

const HeaderSection = ({
  restaurantData,
}: {
  restaurantData: RestaurantDetail;
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
        source={{ uri: restaurantData.logoUrl }}
        transition={300}
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
                fontFamily="gilroyBold"
              >
                {restaurantData.name}
              </CustomText>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <CustomText variant="h6" color={COLORS.black}>
                  {restaurantData.estimatedDeliveryTime}
                </CustomText>
                <Text style={{ fontSize: RFValue(4), color: COLORS.black }}>
                  {"\u2B24"}
                </Text>
                <CustomText variant="h6" color={COLORS.black}>
                  4.5KM
                </CustomText>
              </View>
              <CustomText
                variant="h7"
                color={COLORS.darkGray}
                numberOfLines={2}
                style={{ textTransform: "capitalize" }}
              >
                {restaurantData.address.addressLine1}
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
                4.5
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
