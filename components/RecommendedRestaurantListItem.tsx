import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { RecommendedRestaurantDataTypes } from "types/types";
import { RFValue } from "react-native-responsive-fontsize";
import { Image } from "expo-image";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "utils/constants";
import CustomText from "./customText";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  item: RecommendedRestaurantDataTypes;
  index: number;
  onPress: () => void;
};
const RecommendedRestaurantListItem: React.FC<Props> = ({
  item,
  index,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: "row", gap: RFValue(10) }}
    >
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
            height: RFValue(120),
            width: "100%",
            borderRadius: 20,
          }}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: 20, overflow: "hidden" },
          ]}
        >
          <LinearGradient
            start={{ x: 0.5, y: -0.2 }}
            colors={["transparent", "rgba(0,0,0,0.9)"]}
            style={{
              flex: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
            <View style={{ marginTop: "auto" }}>
              <CustomText variant="h6" fontFamily="gilroyBold" color="white">
                {item.discount}
              </CustomText>
              <CustomText
                variant="h7"
                fontFamily="gilroyBold"
                fontSize={RFValue(6)}
                color={"white"}
                style={{
                  opacity: 0.9,
                }}
              >
                {item.discountAmount}
              </CustomText>
            </View>
          </LinearGradient>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "center", gap: 6 }}>
        <View style={{ position: "absolute", right: 0, top: RFValue(10) }}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={RFValue(18)}
            color={COLORS.darkGray}
          />
        </View>
        <CustomText variant="h5" fontFamily="gilroySemiBold" numberOfLines={1}>
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
          <CustomText variant="h7" fontFamily="gilroyMedium">
            {item.rating}
          </CustomText>
          <CustomText variant="h7" fontFamily="gilroyMedium">
            ({item.distance})
          </CustomText>
          <Text style={{ fontSize: RFValue(4) }}>{"\u2B24"}</Text>
          <CustomText variant="h7" fontFamily="gilroyMedium">
            {item.time}
          </CustomText>
        </View>
        <CustomText
          variant="h7"
          fontFamily="gilroyRegular"
          numberOfLines={2}
          color={COLORS.darkGray}
          style={{ lineHeight: RFValue(14) }}
        >
          {item.address}
        </CustomText>
      </View>
    </Pressable>
  );
};

export default RecommendedRestaurantListItem;
