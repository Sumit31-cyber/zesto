import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC, useCallback, useRef, useState } from "react";
import { MenuItem, RestaurantDetails } from "utils/dataObject";
import { Image } from "expo-image";
import { RFValue } from "react-native-responsive-fontsize";
import DashedLine from "./DashedLine";
import { BORDER_WIDTH, COLORS } from "utils/constants";
import CustomText from "./customText";
import { Feather } from "@expo/vector-icons";
import { useSharedState } from "context/sharedContext";
import CustomizableModal from "./CustomizableModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useDispatch } from "react-redux";
import { RecommendedRestaurantDataTypes } from "types/types";
import { addItemToCart } from "redux/slice/cartSlice";

interface Props {
  item: MenuItem;
  index: number;
  restaurant: RecommendedRestaurantDataTypes;
}

const _imageSize = RFValue(120);
const _addButtonHeight = RFValue(30);
const RestaurantFoodItem: FC<Props> = ({ item, index, restaurant }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const dispatch = useDispatch();
  const { selectedCustomisableItem } = useSharedState();
  const handleAddToCardButtonPress = useCallback(() => {
    if (item.isCustomisable) {
      bottomSheetModalRef.current?.present();
    } else {
    }
  }, [item]);
  return (
    <View style={{}}>
      <CustomizableModal
        modalRef={bottomSheetModalRef}
        item={item}
        onAddToCartPress={() => {
          dispatch(
            addItemToCart({
              item: {
                ...item,
                quantity: selectedCustomisableItem.quantity,
                customisations: [],
              },
              restaurant: restaurant,
            })
          );
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderColor: "black",
          paddingVertical: 20,
          gap: 10,
        }}
      >
        <View style={{ flex: 1, gap: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Image
              style={{ height: 20, aspectRatio: 1 }}
              source={
                item.isVeg
                  ? require("assets/images/vegIcon.png")
                  : require("assets/images/nonvegIcon.png")
              }
            />
            {item.isBestSeller && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: BORDER_WIDTH,
                    backgroundColor: COLORS.liteGray,
                    height: 20,
                    marginHorizontal: 10,
                  }}
                />
                <CustomText variant="h7" color="#e85d04">
                  Bestseller
                </CustomText>
              </View>
            )}
          </View>
          <CustomText variant="h6" numberOfLines={2}>
            {item.name}
          </CustomText>
          <CustomText variant="h7" numberOfLines={2} color={COLORS.darkGray}>
            {item.description}
          </CustomText>
          <CustomText variant="h6" fontFamily="aeonikBold" color={COLORS.black}>
            ₹{item.price}
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              borderWidth: BORDER_WIDTH,
              borderColor: COLORS.liteGray,
              borderRadius: 100,
              alignSelf: "flex-start",
              padding: 5,
            }}
          >
            <Feather
              name="bookmark"
              size={RFValue(12)}
              color={COLORS.darkGray}
            />
          </View>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{ width: _imageSize, aspectRatio: 1, borderRadius: 20 }}
          />
          <View
            style={{
              width: _imageSize,
              paddingHorizontal: RFValue(15),
              top: -_addButtonHeight / 2,
              alignItems: "center",
              gap: RFValue(6),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddToCardButtonPress}
              style={{
                width: "100%",
                height: _addButtonHeight,
                backgroundColor: "#fef2f3",
                borderColor: "#e63946",
                borderWidth: BORDER_WIDTH,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,

                zIndex: 111,
              }}
            >
              <CustomText variant="h4" fontFamily="aeonikBold" color="#e63946">
                ADD
              </CustomText>
            </TouchableOpacity>
            {item.isCustomisable && (
              <CustomText variant="h7" color={COLORS.liteGray}>
                customisable
              </CustomText>
            )}
          </View>
        </View>
        {/* <View style={{ flex: 1, backgroundColor: "green" }}></View>
        <View style={{ height: 300, aspectRatio: 1 }}>
          <Image source={{ uti: item.image }} />
        </View> */}
      </View>
      <DashedLine style={{ borderColor: COLORS.liteGray }} />
    </View>
  );
};

export default RestaurantFoodItem;

const styles = StyleSheet.create({});
