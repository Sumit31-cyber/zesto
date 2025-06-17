import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { RefObject, useState } from "react";
import { CartItem, MenuItem, RestaurantDetails } from "utils/dataObject";
import { Image } from "expo-image";
import CustomText from "./customText";
import { BORDER_WIDTH, COLORS } from "utils/constants";
import { Entypo } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch } from "react-redux";
import { addItemToCart, removeItemFromCart } from "redux/slice/cartSlice";
import { RecommendedRestaurantDataTypes, Restaurant } from "types/types";
import {
  BottomSheetModal,
  useBottomSheet,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";

const MiniFoodItem = ({
  restaurant,
  item,
}: {
  item: CartItem;
  restaurant: Restaurant;
}) => {
  const dispatch = useDispatch();
  const { dismissAll } = useBottomSheetModal();
  return (
    <View style={{ flexDirection: "row", gap: 10, paddingVertical: 10 }}>
      <Image
        style={{ height: 20, aspectRatio: 1 }}
        source={
          item.isVegetarian
            ? require("assets/images/vegIcon.png")
            : require("assets/images/nonvegIcon.png")
        }
      />
      <View style={{ flex: 1 }}>
        <CustomText variant="h6">{item.name}</CustomText>
        <CustomText variant="h7">₹{item.cartPrice?.toFixed(2)}</CustomText>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {item.addons?.map((cus, index) => {
            return (
              <CustomText key={index} variant="h7" color={COLORS.darkGray}>
                {cus.name}{" "}
                {item.addons?.length != undefined &&
                item.addons?.length - 1 != index
                  ? ","
                  : null}
              </CustomText>
            );
          })}
        </View>
      </View>
      <View
        style={{
          marginLeft: "auto",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 40,
            borderRadius: 10,
            zIndex: 111,
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "#effef5",
            borderColor: COLORS.primary,
            borderWidth: BORDER_WIDTH,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              dispatch(
                addItemToCart({
                  item: {
                    ...item,
                    quantity: 1,
                    price: item.cartPrice
                      ? item.cartPrice / item.quantity
                      : item.price,
                    addons: item.addons,
                  },
                  restaurant: restaurant,
                })
              );
            }}
            style={{
              height: "100%",
              paddingHorizontal: RFValue(6),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Entypo name="plus" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <CustomText variant="h6" fontFamily="gilroyBold" color="black">
            {item.quantity}
          </CustomText>
          <TouchableOpacity
            onPress={() => {
              dispatch(
                removeItemFromCart({
                  restaurant: restaurant,
                  item: {
                    ...item,
                    price: item.cartPrice
                      ? item.cartPrice / item.quantity
                      : item.price,
                  },
                })
              );
              if (item.quantity == 1) {
                dismissAll();
              }
            }}
            style={{
              height: "100%",
              paddingHorizontal: RFValue(6),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Entypo name="minus" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MiniFoodItem;

const styles = StyleSheet.create({});
