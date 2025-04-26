import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  BOTTOM_TAB_HEIGHT,
  COLORS,
  FONTS,
  PADDING_HORIZONTAL,
  screenHeight,
  screenWidth,
} from "utils/constants";
import CustomText from "components/customText";
import { RFValue } from "react-native-responsive-fontsize";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import RecommendedRestaurantListItem from "components/RecommendedRestaurantListItem";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  interpolate,
  LinearTransition,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSharedState } from "context/sharedContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const headerHeight = screenHeight * 0.06;

const Favorite = () => {
  const { favorites } = useSelector((state: RootState) => state.favorite);
  const { top } = useSafeAreaInsets();
  const { scrollY } = useSharedState();

  const flatListScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const isScrollingDown = currentScrollY > flatListScrollY.value;
      flatListScrollY.value = currentScrollY;
      scrollY.value = isScrollingDown ? withTiming(0) : withTiming(1);
    },
  });

  const rStyle = useAnimatedStyle(() => {
    const opacity = interpolate(flatListScrollY.value, [0, 100], [0, 1]);
    return {
      opacity,
    };
  });

  const handleBackNavigation = () => {
    router.back();
    scrollY.value = withTiming(1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Animated.View
        style={[
          {
            height: headerHeight + top,
            width: "100%",
            justifyContent: "flex-end",
            paddingHorizontal: PADDING_HORIZONTAL,
            paddingVertical: RFValue(5),
            position: "absolute",
            zIndex: 100,
          },
        ]}
      >
        <View
          style={{
            height: headerHeight,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={handleBackNavigation}
            style={{
              height: RFValue(30),
              aspectRatio: 1,
              backgroundColor: "rgba(1,1,1,0.1)",
              borderRadius: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            rStyle,
            {
              backgroundColor: "white",
              alignItems: "flex-end",
              paddingHorizontal: PADDING_HORIZONTAL,
              paddingVertical: RFValue(5),
              flexDirection: "row",
              gap: RFValue(4),
            },
          ]}
        >
          <View
            style={{
              height: headerHeight,
              width: "100%",
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={handleBackNavigation}
              style={{
                height: RFValue(30),
                aspectRatio: 1,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 100,
              }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <CustomText variant="h6" fontFamily="gilroyMedium">
                Favorites Restaurants
              </CustomText>
              <CustomText variant="h7" color={COLORS.darkGray}>
                {favorites.length} Items
              </CustomText>
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.FlatList
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        data={favorites}
        bounces={false}
        scrollEnabled={favorites.length > 0}
        itemLayoutAnimation={LinearTransition}
        ListHeaderComponent={
          <>{favorites.length > 0 && <ListHeaderComponent />}</>
        }
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{ paddingBottom: screenHeight * 0.3 }}
        renderItem={({ item, index }) => {
          return (
            <Animated.View
              style={{
                paddingHorizontal: PADDING_HORIZONTAL,
                marginTop: PADDING_HORIZONTAL,
              }}
            >
              <RecommendedRestaurantListItem
                key={index}
                item={item}
                index={index}
                onPress={() => {
                  router.navigate({
                    pathname: "/(protected)/restaurant",
                    params: { restaurantId: item.id },
                  });
                }}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

export default Favorite;

const styles = StyleSheet.create({});

const ListEmptyComponent = () => {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        flex: 1,
        marginTop: screenHeight * 0.12,
        marginBottom: BOTTOM_TAB_HEIGHT,
        alignItems: "center",
      }}
    >
      <CustomText
        variant="h7"
        style={{ textTransform: "uppercase", letterSpacing: 0.8 }}
      >
        Your
      </CustomText>
      <CustomText
        variant="h1"
        fontFamily="gilroyExtraBold"
        style={{ marginTop: 5 }}
      >
        Taste Portfolio!
      </CustomText>
      <Image
        source={require("assets/images/emptyIllustration.webp")}
        style={{ width: screenWidth, aspectRatio: 1 }}
      />
      <CustomText
        variant="h1"
        style={{ textAlign: "center", opacity: 0.4 }}
        fontFamily="gilroyExtraBold"
        fontSize={RFValue(18)}
        color={COLORS.darkGray}
      >
        Save your favorite restaurant to your Taste Portfolio
      </CustomText>
    </Animated.View>
  );
};

const ListHeaderComponent = () => {
  return (
    <View
      style={{
        height: screenHeight * 0.45,
        width: "100%",
        backgroundColor: COLORS.primary,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: screenHeight * 0.2,
          width: "100%",
          marginTop: "auto",
        }}
      >
        <View
          style={{
            maxWidth: "60%",
            marginHorizontal: RFValue(10),
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CustomText variant="h2" fontFamily="gilroyExtraBold" color="white">
            We Know
          </CustomText>
          <CustomText variant="h2" fontFamily="gilroyExtraBold" color="white">
            You love it!
          </CustomText>
          <CustomText
            variant="h6"
            color="white"
            style={{ marginTop: RFValue(4) }}
          >
            Browse your favorite restaurants & feast like never before{" "}
          </CustomText>
        </View>
        <Image
          contentFit="contain"
          source={require("assets/rolls.png")}
          style={{
            height: screenWidth * 0.4,
            aspectRatio: 1,
            position: "absolute",
            right: -RFValue(24),
          }}
        />
      </View>
      <Image
        contentFit="contain"
        source={require("assets/images/bowlPng.png")}
        style={{
          height: screenWidth * 0.6,
          aspectRatio: 1,
          position: "absolute",
          right: -screenWidth * 0.15,
          top: -screenWidth * 0.15,
        }}
      />
      <Image
        contentFit="contain"
        source={require("assets/noodles.png")}
        style={{
          height: screenWidth * 0.3,
          aspectRatio: 1,
          position: "absolute",
          left: screenWidth * 0.15,
          top: RFValue(50),
        }}
      />
    </View>
  );
};
