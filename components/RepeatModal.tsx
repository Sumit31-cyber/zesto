import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { RefObject, useMemo } from "react";

import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  MenuItem,
  RecommendedRestaurantDataTypes,
  Restaurant,
} from "types/types";
import ModalBackdrop from "./ModalBackdrop";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomText from "./customText";
import Divider from "./Divider";
import { COLORS, PADDING_HORIZONTAL } from "utils/constants";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import MiniFoodItem from "./MiniFoodItem";
import { Entypo } from "@expo/vector-icons";

const RepeatModal = ({
  foodItem,
  modalRef,
  restaurant,
  onAddNewCustomizable,
}: {
  foodItem: MenuItem;
  modalRef: RefObject<BottomSheetModal>;
  restaurant: Restaurant;
  onAddNewCustomizable: () => void;
}) => {
  const { bottom } = useSafeAreaInsets();
  const { carts } = useSelector((state: RootState) => state.cart);

  const cart = useMemo(() => {
    const existingRestaurant = carts.find(
      (cart) => cart.restaurant.name === restaurant.name
    );

    if (!existingRestaurant) return null;

    const foodWithSameId = existingRestaurant.items.filter(
      (option) => option.id === foodItem.id
    );

    return foodWithSameId;
  }, [carts, restaurant.name, foodItem.id]);

  return (
    <BottomSheetModal
      ref={modalRef}
      onChange={(value) => {
        if (value === -1) {
          // initializeCustomizableItem(0);
        }
      }}
      backdropComponent={ModalBackdrop}
    >
      <BottomSheetView
        style={{
          paddingHorizontal: 0,
          backgroundColor: "#fff",
          maxHeight: RFValue(500),
        }}
      >
        <View
          style={{ paddingVertical: 14, paddingHorizontal: PADDING_HORIZONTAL }}
        >
          <CustomText variant="h6" fontFamily="gilroyBold">
            Repeat last used customizations?
          </CustomText>
        </View>
        <Divider />

        <View style={{ paddingHorizontal: PADDING_HORIZONTAL }}>
          <FlatList
            keyExtractor={(item, index) => `item.id-${index}`}
            data={cart}
            renderItem={({ item, index }) => (
              <MiniFoodItem key={index} restaurant={restaurant} item={item} />
            )}
          />
          <Pressable
            onPress={onAddNewCustomizable}
            style={{
              flexDirection: "row",
              paddingBottom: bottom,
              paddingVertical: 20,
              alignSelf: "center",
            }}
          >
            <Entypo name="plus" size={20} color={"red"} />
            <CustomText variant="h6" color="red" fontFamily="gilroyBold">
              Add new customizations
            </CustomText>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default RepeatModal;

const styles = StyleSheet.create({});
