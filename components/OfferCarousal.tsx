import {
  Easing,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
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
            <RenderCards
              key={item.id}
              item={item}
              index={index}
              scrollX={scrollX}
            />
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

interface CardProps {
  item: {
    id: number;
    title: string;
    description: string;
    image: ImageSourcePropType;
    gradient: string[];
  };
  scrollX: SharedValue<number>;
  index: number;
}

const RenderCards = ({ item, index, scrollX }: CardProps) => {
  const rStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      scrollX.value,
      [
        (index - 1) * _imageWidth,
        index * _imageWidth,
        (index + 1) * _imageWidth,
      ],
      [30, 0, -30],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollX.value,
      [
        (index - 1) * _imageWidth,
        index * _imageWidth,
        (index + 1) * _imageWidth,
      ],
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        {
          rotate: `${withSpring(rotation, { damping: 15, stiffness: 200 })}deg`,
        },
        { scale: withSpring(scale, { damping: 12, stiffness: 180 }) },
      ],
    };
  });
  return (
    <LinearGradient
      //@ts-ignore
      colors={item.gradient}
      style={{
        height: 150,
        width: _imageWidth,
        marginTop: gap,
        borderRadius: 10,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#ffffff80",
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
      <Animated.View style={[rStyle]}>
        <Image
          source={item.image}
          contentFit="contain"
          style={{
            height: "100%",
            aspectRatio: 1,
          }}
        />
      </Animated.View>
    </LinearGradient>
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
          backgroundColor: "white",
          borderRadius: 100,
        },
      ]}
    ></Animated.View>
  );
};

export default OfferCarousel;
const offerList: OfferItem[] = [
  {
    id: 4,
    title: "get item at ₹9",
    description: "and enjoy free delivery",
    image: require("assets/image5.png"),
    gradient: ["#4d5d2e80", "#80994960", "#d5dfb750"],
  },
  {
    id: 0,
    title: "Get 60% OFF ",
    description: "or get upto ₹120 off",
    image: require("assets/image1.png"),
    gradient: ["#1aa1c080", "#35bedb60", "#ade9f450"],
  },
  {
    id: 1,
    title: "Buy 1 get 1 free",
    description: "Epic savings",
    image: require("assets/image2.png"),
    gradient: ["#6221ff80", "#947bff60", "#b7abff50"],
  },
  {
    id: 2,
    title: "Get 60% OFF",
    description: "on heavenly dishes",
    image: require("assets/image3.webp"),
    gradient: ["#9437d580", "#9437d560", "#9437d550"],
  },
  {
    id: 3,
    title: "Taste the trends",
    description: "on mouth watering dish",
    image: require("assets/image4.png"),
    gradient: ["#168aad80", "#32c2de60", "#acebf550"],
  },
];
