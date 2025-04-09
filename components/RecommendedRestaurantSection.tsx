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

const RecommendedRestaurantSection = () => {
  return (
    <View style={{ paddingHorizontal: PADDING_HORIZONTAL }}>
      <CustomText
        variant="h6"
        fontFamily="aeonikBold"
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
            <ListItems
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

const ListItems = ({
  item,
  index,
  onPress,
}: {
  item: RecommendedRestaurantDataTypes;
  index: number;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", gap: 10 }}>
      <View
        style={{
          width: RFValue(100),
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 2,
          borderRadius: 30,
        }}
      >
        <Image
          contentFit="cover"
          source={{ uri: item.imageUrl }}
          style={{
            height: 180,
            width: "100%",
            borderRadius: 30,
          }}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "center", gap: 6 }}>
        <View style={{ position: "absolute", right: 0, top: RFValue(10) }}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={RFValue(18)}
            color={COLORS.darkGray}
          />
        </View>
        <CustomText variant="h5" fontFamily="aeonikBold" numberOfLines={1}>
          {item.name}
        </CustomText>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
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
            <AntDesign name="star" size={RFValue(10)} color="white" />
          </View>
          <CustomText variant="h7">{item.rating}</CustomText>
          <CustomText variant="h7">({item.distance})</CustomText>
          <Text style={{ fontSize: RFValue(4) }}>{"\u2B24"}</Text>
          <CustomText variant="h7">{item.time}</CustomText>
        </View>
        <CustomText variant="h6" numberOfLines={2} color={COLORS.darkGray}>
          {item.address}
        </CustomText>
      </View>
    </Pressable>
  );
};
