import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import { MenuItem, RestaurantDetails } from "utils/dataObject";
import { Image } from "expo-image";
import { RFValue } from "react-native-responsive-fontsize";
import DashedLine from "./DashedLine";
import { BORDER_WIDTH, COLORS } from "utils/constants";
import CustomText from "./customText";
import { Entypo, Feather } from "@expo/vector-icons";
import { useSharedState } from "context/sharedContext";
import CustomizableModal from "./CustomizableModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { RecommendedRestaurantDataTypes } from "types/types";
import { addItemToCart, removeItemFromCart } from "redux/slice/cartSlice";
import { RootState } from "redux/store";

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
  const {
    selectedCustomisableItem,
    setSelectedCustomisableItem,
    initializeCustomisableItem,
  } = useSharedState();
  const { carts } = useSelector((state: RootState) => state.cart);

  const cart = useMemo(() => {
    let existingItem = null;
    const existingRestaurant = carts.find(
      (item) => item.restaurant.name === restaurant.name
    );

    if (existingRestaurant) {
      const foodItem = existingRestaurant.items.find(
        (options) => options.id == item.id
      );

      if (foodItem) {
        existingItem = foodItem;
      }
    }
    return existingItem;
  }, [carts]);

  const handleAddToCardButtonPress = useCallback(() => {
    if (item.isCustomisable) {
      bottomSheetModalRef.current?.present();
      initializeCustomisableItem(item.price);
    } else {
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
      // initializeCustomisableItem(0);
    }
  }, [item, cart, carts, selectedCustomisableItem]);

  return (
    <View style={{}}>
      <CustomizableModal
        modalRef={bottomSheetModalRef}
        item={item}
        restaurant={restaurant}
        onAddToCartPress={() => {
          bottomSheetModalRef.current?.dismiss();
          dispatch(
            addItemToCart({
              item: {
                ...item,
                price: selectedCustomisableItem.price,
                quantity: selectedCustomisableItem.quantity,
                customisations: selectedCustomisableItem.selectedOptions,
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
            {cart && cart?.quantity > 0 ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAddToCardButtonPress}
                style={{
                  width: "100%",
                  height: _addButtonHeight,
                  backgroundColor: COLORS.primary,
                  borderColor: COLORS.primary,
                  borderWidth: BORDER_WIDTH,
                  borderRadius: 10,
                  zIndex: 111,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={handleAddToCardButtonPress}
                  style={{
                    height: "100%",
                    paddingHorizontal: RFValue(6),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Entypo name="plus" size={24} color="white" />
                </TouchableOpacity>
                <CustomText variant="h4" fontFamily="aeonikBold" color="white">
                  {cart.quantity}
                </CustomText>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      removeItemFromCart({ restaurant: restaurant, item: item })
                    );
                  }}
                  style={{
                    height: "100%",
                    paddingHorizontal: RFValue(6),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Entypo name="minus" size={24} color="white" />
                </TouchableOpacity>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAddToCardButtonPress}
                style={{
                  width: "100%",
                  height: _addButtonHeight,
                  backgroundColor: "#effef5",
                  borderColor: COLORS.primary,
                  borderWidth: BORDER_WIDTH,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  zIndex: 111,
                }}
              >
                <CustomText
                  variant="h4"
                  fontFamily="aeonikBold"
                  color={COLORS.primary}
                >
                  ADD
                </CustomText>
              </TouchableOpacity>
            )}

            {item.isCustomisable && (
              <CustomText variant="h7" color={COLORS.liteGray}>
                customisable
              </CustomText>
            )}
          </View>
        </View>
      </View>
      <DashedLine style={{ borderColor: COLORS.liteGray }} />
    </View>
  );
};

export default RestaurantFoodItem;

const styles = StyleSheet.create({});
