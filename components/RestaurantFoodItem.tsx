import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import { RestaurantDetails } from "utils/dataObject";
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
import { MenuItem, Restaurant } from "types/types";
import { addItemToCart, removeItemFromCart } from "redux/slice/cartSlice";
import { RootState } from "redux/store";
import RepeatModal from "./RepeatModal";

interface Props {
  item: MenuItem;
  index: number;
  restaurant: Restaurant;
}

const _imageSize = RFValue(120);
const _addButtonHeight = RFValue(30);
const RestaurantFoodItem: FC<Props> = ({ item, index, restaurant }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const repeatModalRef = useRef<BottomSheetModal>(null);
  const dispatch = useDispatch();
  const isCustomizable = item.addons && item.addons?.length > 0;
  const {
    selectedCustomizableItem,
    setSelectedCustomizableItem,
    initializeCustomizableItem,
  } = useSharedState();
  const { carts } = useSelector((state: RootState) => state.cart);

  const cart = useMemo(() => {
    const existingRestaurant = carts.find(
      (cart) => cart.restaurant.name === restaurant.name
    );

    if (!existingRestaurant) return null;

    const sameFoodItems = existingRestaurant.items.filter(
      (options) => options.id === item.id
    );

    if (sameFoodItems.length === 0) return null;

    const totalQuantity = sameFoodItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return {
      ...sameFoodItems[0],
      quantity: totalQuantity,
      variants: sameFoodItems,
    };
  }, [carts, restaurant.name, item.id]);

  const handleAddToCardButtonPress = useCallback(() => {
    if (isCustomizable) {
      if (cart && cart?.quantity != 0) {
        repeatModalRef.current?.present();
      } else {
        bottomSheetModalRef.current?.present();
        initializeCustomizableItem(item.price);
      }
    } else {
      dispatch(
        addItemToCart({
          item: {
            ...item,
            quantity: selectedCustomizableItem.quantity,
            addons: [],
          },
          restaurant: restaurant,
        })
      );
    }
  }, [item, cart, carts, selectedCustomizableItem]);

  return (
    <View style={{}}>
      <CustomizableModal
        modalRef={bottomSheetModalRef}
        menuItem={item}
        restaurant={restaurant}
        onAddToCartPress={() => {
          bottomSheetModalRef.current?.dismiss();
          dispatch(
            addItemToCart({
              item: {
                ...item,
                price: selectedCustomizableItem.price,
                quantity: selectedCustomizableItem.quantity,
                addons: selectedCustomizableItem.selectedOptions,
              },
              restaurant: restaurant,
            })
          );
        }}
      />
      <RepeatModal
        modalRef={repeatModalRef}
        foodItem={item}
        restaurant={restaurant}
        onAddNewCustomizable={() => {
          repeatModalRef?.current?.dismiss();
          bottomSheetModalRef?.current?.present();
          initializeCustomizableItem(item.price);
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
                item.isVegetarian
                  ? require("assets/images/vegIcon.png")
                  : require("assets/images/nonvegIcon.png")
              }
            />
            {/* //TODO : Fix this (default true) */}
            {true && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: BORDER_WIDTH,
                    backgroundColor: COLORS.gray,
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
          <CustomText variant="h6" fontFamily="gilroyBold" color={COLORS.black}>
            ₹{item.price}
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              borderWidth: BORDER_WIDTH,
              borderColor: COLORS.gray,
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
            source={{ uri: item.imageUrl }}
            transition={300}
            style={{
              width: _imageSize,
              aspectRatio: 1,
              borderRadius: 20,
              backgroundColor: "#d8f3dc50",
            }}
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
              <View
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
                <CustomText variant="h4" fontFamily="gilroyBold" color="white">
                  {cart.quantity}
                </CustomText>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      removeItemFromCart({
                        restaurant: restaurant,
                        item: cart,
                      })
                    );
                    // if (cart.quantity === 1) {
                    //   dispatch(
                    //     removeItemFromCart({
                    //       restaurant: restaurant,
                    //       item: cart,
                    //     })
                    //   );
                    // } else {
                    //   // repeatModalRef.current?.present();
                    //   console.log("This ");
                    // }
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
              </View>
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
                  fontFamily="gilroyBold"
                  color={COLORS.primary}
                >
                  ADD
                </CustomText>
              </TouchableOpacity>
            )}
            {item.addons && item.addons.length > 0 && (
              <CustomText variant="h7" color={COLORS.darkGray}>
                customizable
              </CustomText>
            )}
          </View>
        </View>
      </View>
      <DashedLine style={{ borderColor: COLORS.gray }} />
    </View>
  );
};

export default RestaurantFoodItem;

const styles = StyleSheet.create({});
