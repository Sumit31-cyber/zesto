import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, RefObject, useCallback, useMemo, useState } from "react";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSharedState } from "context/sharedContext";
import ModalBackdrop from "./ModalBackdrop";
import { RFValue } from "react-native-responsive-fontsize";
import {
  MenuItem,
  CustomizationGroup,
  CustomizationOption,
} from "utils/dataObject";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BORDER_WIDTH, COLORS, PADDING_HORIZONTAL } from "utils/constants";
import CustomText from "./customText";
import { Feather } from "@expo/vector-icons";
import DashedLine from "./DashedLine";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "redux/slice/cartSlice";
import { RootState } from "redux/store";
import { RecommendedRestaurantDataTypes } from "types/types";

const CustomizableModal = ({
  item,
  modalRef,
  restaurant,
  onAddToCartPress,
}: {
  item: MenuItem;
  modalRef: RefObject<BottomSheetModal>;
  onAddToCartPress: () => void;
  restaurant: RecommendedRestaurantDataTypes;
}) => {
  const { bottomSheetModalRef } = useSharedState();
  const { bottom } = useSafeAreaInsets();
  const { setSelectedCustomisableItem } = useSharedState();
  const { carts } = useSelector((state: RootState) => state.cart);

  const prePopulateValues = useCallback(() => {
    // Find the cart for the current restaurant
    const restaurantCart = carts.find(
      (cart) => cart.restaurant.name === restaurant.name
    );

    if (!restaurantCart) {
      // Reset to defaults if no cart exists for this restaurant
      setSelectedCustomisableItem({
        quantity: 1,
        price: item.price, // Use the base price from the menu item
        selectedOptions: [],
      });
      return;
    }

    // Find the existing item in the cart
    const existingItem = restaurantCart.items.find(
      (cartItem) => cartItem.id === item.id // Better to compare by ID than name
    );

    setSelectedCustomisableItem({
      quantity: existingItem?.quantity || 1,
      price: existingItem?.price || item.price,
      selectedOptions: existingItem?.customisations || [],
    });
  }, [carts, restaurant.name, item.id, item.price]); // Add all dependencies
  // const snapPoints = useMemo(() => ["60%"], []);
  return (
    <BottomSheetModal
      ref={modalRef}
      onChange={(value) => {
        if (value === -1) {
          setSelectedCustomisableItem({
            price: 0,
            quantity: 1,
            selectedOptions: [],
          });
        } else {
          prePopulateValues();
        }
      }}
      backdropComponent={ModalBackdrop}
    >
      <BottomSheetView
        style={{
          paddingBottom: bottom,
          paddingHorizontal: 0,
          // backgroundColor: "#e9e8ee",
          backgroundColor: "#f8f9fa",
          maxHeight: RFValue(500),
        }}
      >
        <Header item={item} />
        <FlatList
          data={item.customizationOptions}
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: RFValue(50) }}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  marginHorizontal: PADDING_HORIZONTAL,
                  marginVertical: PADDING_HORIZONTAL,
                  backgroundColor: "white",
                  borderRadius: 10,
                  shadowColor: "#fff",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.07,
                  shadowRadius: 1,
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    paddingVertical: PADDING_HORIZONTAL,
                    paddingHorizontal: PADDING_HORIZONTAL,
                    gap: 4,
                  }}
                >
                  <CustomText
                    variant="h6"
                    fontFamily="aeonikBold"
                    color={COLORS.black}
                  >
                    {item.type}
                  </CustomText>
                  <CustomText
                    variant="h7"
                    color={COLORS.black}
                    style={{ textTransform: "capitalize" }}
                  >
                    select your {item.type}
                  </CustomText>
                </View>

                <DashedLine />
                <View style={{ gap: 10, paddingVertical: 10 }}>
                  {item.options.map((item, index) => {
                    return <OptionItems key={index} item={item} />;
                  })}
                </View>
              </View>
            );
          }}
        />

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            paddingHorizontal: PADDING_HORIZONTAL,
            position: "absolute",
            bottom: bottom,
            width: "100%",
            zIndex: 100,
          }}
        >
          <View
            style={{
              height: RFValue(40),
              flex: 0.3,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 14,
              borderWidth: BORDER_WIDTH,
              borderColor: COLORS.primary,
              backgroundColor: "#effef5",
            }}
          ></View>
          <TouchableOpacity
            onPress={onAddToCartPress}
            style={{
              height: RFValue(40),
              flex: 0.7,
              backgroundColor: COLORS.primary,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 14,
            }}
          >
            <CustomText variant="h5" color={"white"}>
              Add item to cart
            </CustomText>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default CustomizableModal;

const styles = StyleSheet.create({});

const OptionItems = memo(({ item }: { item: CustomizationOption }) => {
  const { selectedCustomisableItem, setSelectedCustomisableItem } =
    useSharedState();

  const exists = useMemo(() => {
    return selectedCustomisableItem.selectedOptions.some(
      (option) => option.name === item.name
    );
  }, [selectedCustomisableItem.selectedOptions, item.name]);

  const handleSelection = () => {
    console.log(selectedCustomisableItem);
    if (!exists) {
      console.log("Adding Item");
      setSelectedCustomisableItem((prev) => ({
        ...prev,
        selectedOptions: [item, ...prev.selectedOptions],
      }));
    } else {
      console.log("Removing Item");
      const filteredItem = selectedCustomisableItem.selectedOptions.filter(
        (options) => options.name != item.name
      );
      console.log(filteredItem);
      setSelectedCustomisableItem((prev) => ({
        ...prev,
        selectedOptions: filteredItem,
      }));
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: PADDING_HORIZONTAL,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <CustomText variant="h6">{item.name}</CustomText>

      <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
        <CustomText variant="h6">₹{item.price}</CustomText>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSelection}
          style={{
            height: 18,
            aspectRatio: 1,
            borderRadius: 100,
            borderWidth: BORDER_WIDTH,
            borderColor: COLORS.primary,
          }}
        >
          {exists && (
            <Animated.View
              entering={ZoomIn}
              exiting={ZoomOut}
              style={{
                flex: 1,
                backgroundColor: COLORS.primary,
                borderRadius: 100,
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});

const Header = ({ item }: { item: MenuItem }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingBottom: 10,
        paddingHorizontal: PADDING_HORIZONTAL,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Image
        style={{ height: RFValue(40), aspectRatio: 1, borderRadius: 10 }}
        source={{ uri: item.image }}
      />
      <CustomText variant="h6">{item.name}</CustomText>
      <View
        style={{
          flexDirection: "row",
          borderWidth: BORDER_WIDTH,
          borderColor: COLORS.liteGray,
          borderRadius: 100,
          padding: 5,
          marginLeft: "auto",
        }}
      >
        <Feather name="bookmark" size={RFValue(12)} color={COLORS.darkGray} />
      </View>
    </View>
  );
};
