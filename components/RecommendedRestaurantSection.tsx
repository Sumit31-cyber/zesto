import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS, PADDING_HORIZONTAL } from "utils/constants";
import CustomText from "./customText";
import { recommendedListData } from "utils/dataObject";
import { RecommendedRestaurantDataTypes } from "types/types";
import { Image } from "expo-image";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { router } from "expo-router";
import RecommendedRestaurantListItem from "./RecommendedRestaurantListItem";

const RecommendedRestaurantSection = () => {
  return (
    <View style={{ paddingHorizontal: PADDING_HORIZONTAL }}>
      <CustomText
        variant="h6"
        fontFamily="gilroyBold"
        style={{ marginVertical: 10 }}
      >
        Top {recommendedListData.length} restaurants to explore
      </CustomText>

      <FlatList
        keyExtractor={(_, index) => `${index}-restaurant`}
        data={recommendedListData}
        style={{ marginTop: RFValue(10), gap: RFValue(18) }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        renderItem={({
          item,
          index,
        }: {
          item: RecommendedRestaurantDataTypes;
          index: number;
        }) => {
          return (
            <RecommendedRestaurantListItem
              key={index}
              item={item}
              index={index}
              onPress={() => {
                router.navigate({
                  pathname: "/(protected)/restaurant",
                  params: { restaurant: JSON.stringify(item) },
                });
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default RecommendedRestaurantSection;

const styles = StyleSheet.create({});
