import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  BORDER_WIDTH,
  COLORS,
  PADDING_HORIZONTAL,
  screenHeight,
  screenWidth,
} from "utils/constants";
import { foodType } from "utils/dataObject";
import { Image } from "expo-image";
import { FoodTypesProps } from "types/types";
import CustomText from "./customText";
import Divider from "./Divider";

const _containerHeight = screenWidth * 0.3;
const FoodTypeSection = () => {
  return (
    <View style={{ marginVertical: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <Divider />
        <CustomText
          variant="h7"
          color={COLORS.black}
          style={{ textTransform: "uppercase" }}
        >
          Sumit, What's on your mind?
        </CustomText>
        <Divider />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "column" }}>
          <View style={{ flexDirection: "row" }}>
            {foodType.slice(0, 9).map((item, index) => {
              return <RenderItem key={index} item={item} index={index} />;
            })}
          </View>
          <View style={{ flexDirection: "row" }}>
            {foodType.slice(9, 18).map((item, index) => {
              return <RenderItem key={index} item={item} index={index} />;
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FoodTypeSection;

const RenderItem = ({
  item,
  index,
}: {
  item: FoodTypesProps;
  index: number;
}) => {
  return (
    <View
      key={`${index}-${item.name}`}
      style={{
        height: _containerHeight,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
      }}
    >
      <Image source={item.image} style={{ height: "70%", aspectRatio: 1 }} />
      <CustomText
        variant="h7"
        color={COLORS.darkGray}
        fontFamily="gilroyMedium"
        style={{ textTransform: "capitalize" }}
      >
        {item.name}
      </CustomText>
    </View>
  );
};
