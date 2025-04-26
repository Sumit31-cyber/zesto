import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  COLORS,
  PADDING_HORIZONTAL,
  screenHeight,
  screenWidth,
} from "utils/constants";
import { DineOutRestaurant, dineOutRestaurantsList } from "utils/dataObject";
import CustomText from "./customText";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import SectionHeader from "./SectionHeader";

const _imageWidth = screenWidth * 0.8;
const _imageHeight = screenHeight * 0.24;
const _spacing = screenWidth * 0.035;
const LimelightRestaurantCarousal = () => {
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x / (_imageWidth + _spacing);
  });

  const ImageItem = ({
    item,
    index,
  }: {
    item: DineOutRestaurant;
    index: number;
  }) => {
    const rStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(
              scrollX.value,
              [index - 1, index, index + 1],
              [1.4, 1, 1.4]
            ),
          },
          {
            rotate: `${interpolate(
              scrollX.value,
              [index - 1, index, index + 1],
              [10, 0, -10]
            )}deg`,
          },
        ],
      };
    });

    return (
      <View
        style={{
          height: _imageHeight,
          width: _imageWidth,
          overflow: "hidden",
          borderRadius: 10,
        }}
      >
        <View style={[StyleSheet.absoluteFill, { zIndex: 100 }]}>
          <View
            style={{
              paddingHorizontal: PADDING_HORIZONTAL,
              paddingVertical: RFValue(10),
              marginTop: "auto",
            }}
          >
            <LinearGradient
              colors={["rgba(15, 183, 88,0.6)", "rgba(0,0,0,0.2)"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            ></LinearGradient>
            <CustomText variant="h5" color="white" fontFamily="gilroyBold">
              {item.name}
            </CustomText>
            <CustomText variant="h7" color="white" fontFamily="gilroySemiBold">
              {item.address}
            </CustomText>
          </View>
        </View>
        <Animated.Image
          source={{ uri: item.image }}
          style={[rStyle, { flex: 1 }]}
        />
      </View>
    );
  };
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SectionHeader title="In the limelight" />
      <Animated.FlatList
        onScroll={onScroll}
        data={dineOutRestaurantsList}
        horizontal
        showsHorizontalScrollIndicator={false}
        disableIntervalMomentum
        scrollEventThrottle={1000 / 60}
        decelerationRate={"fast"}
        snapToInterval={_imageWidth + _spacing}
        contentContainerStyle={{
          gap: _spacing,
          paddingHorizontal: (screenWidth - _imageWidth) / 2,
        }}
        style={{ flexGrow: 0 }}
        renderItem={({ item, index }) => {
          return <ImageItem key={item.id} index={index} item={item} />;
        }}
      />
    </View>
  );
};

export default LimelightRestaurantCarousal;
