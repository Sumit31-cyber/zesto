import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { COLORS, PADDING_HORIZONTAL, screenWidth } from "utils/constants";
import { OfferItem } from "types/types";
import CustomText from "./customText";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

const _imageWidth = screenWidth * 0.85;
const gap = 20;
const _indicatorSize = 5;

const OfferCarousel = () => {
  const scrollX = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  return (
    <View>
      <Animated.ScrollView
        horizontal
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        style={{ flexDirection: "row" }}
        bounces={false}
        contentContainerStyle={{
          paddingHorizontal: PADDING_HORIZONTAL,
          gap: gap,
        }}
        snapToAlignment="start"
        snapToInterval={_imageWidth + gap}
        decelerationRate={"fast"}
      >
        {offerList.map((item, index) => {
          return (
            <LinearGradient
              key={item.id}
              colors={item.gradient}
              style={{
                height: 150,
                width: _imageWidth,
                backgroundColor: "red",
                marginTop: gap,
                borderRadius: 10,
                flexDirection: "row",
              }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              locations={[0, 0.7, 0.9]}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingHorizontal: 20,
                  gap: 4,
                }}
              >
                <CustomText variant="h5" fontFamily="gilroyBold" color="white">
                  {item.title}
                </CustomText>
                <CustomText variant="h6" color="white">
                  {item.description}
                </CustomText>
                <Pressable
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 12,
                    backgroundColor: "white",
                    alignSelf: "flex-start",
                    borderRadius: 100,
                    marginTop: 8,
                  }}
                >
                  <CustomText variant="h7">Order now</CustomText>
                </Pressable>
              </View>
              <Image
                source={item.image}
                contentFit="contain"
                style={{
                  height: "100%",
                  aspectRatio: 1,
                }}
              />
            </LinearGradient>
          );
        })}
      </Animated.ScrollView>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginVertical: gap,
          gap: 3,
        }}
      >
        {offerList.map((item, index) => {
          return (
            <RenderIndicatorItem key={index} scrollX={scrollX} index={index} />
          );
        })}
      </View>
    </View>
  );
};

interface renderIndicatorProps {
  scrollX: SharedValue<number>;
  index: number;
}

const RenderIndicatorItem = ({ scrollX, index }: renderIndicatorProps) => {
  const rStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollX.value,
      [
        (index - 1) * _imageWidth,
        index * _imageWidth,
        (index + 1) * _imageWidth,
      ],
      [_indicatorSize, _indicatorSize * 4, _indicatorSize],
      Extrapolation.CLAMP
    );

    return {
      width: width,
    };
  });

  return (
    <Animated.View
      style={[
        rStyle,
        {
          height: _indicatorSize,
          backgroundColor: COLORS.primary,
          borderRadius: 100,
        },
      ]}
    ></Animated.View>
  );
};

export default OfferCarousel;
const offerList: OfferItem[] = [
  {
    id: 0,
    title: "Get 60% OFF ",
    description: "or get upto ₹120 off",
    image: require("assets/image1.png"),
    gradient: ["#1aa1c0", "#35bedb", "#ade9f4"],
  },
  {
    id: 1,
    title: "Buy 1 get 1 free",
    description: "Epic savings",
    image: require("assets/image2.png"),
    gradient: ["#6221ff", "#947bff", "#b7abff"],
  },
  {
    id: 2,
    title: "Get 60% OFF",
    description: "on heavenly dishes",
    image: require("assets/image3.webp"),
    gradient: ["#f63f00", "#ff5c09", "#ffae6c"],
  },
  {
    id: 3,
    title: "Taste the trends",
    description: "on mouth watering dish",
    image: require("assets/image4.png"),
    gradient: ["#168aad", "#32c2de", "#acebf5"],
  },
  {
    id: 4,
    title: "get item at ₹9",
    description: "and enjoy free delivery",
    image: require("assets/image5.png"),
    gradient: ["#4d5d2e", "#809949", "#d5dfb7"],
  },
];
