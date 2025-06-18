import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, RefObject, useCallback, useMemo, useState } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useSharedState } from "context/sharedContext";
import ModalBackdrop from "./ModalBackdrop";
import { RFValue } from "react-native-responsive-fontsize";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BORDER_WIDTH, COLORS, PADDING_HORIZONTAL } from "utils/constants";
import CustomText from "./customText";
import { Entypo, Feather } from "@expo/vector-icons";
import DashedLine from "./DashedLine";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, selectRestaurantCartItem } from "redux/slice/cartSlice";
import { ItemAddon, MenuItem, Restaurant, RestaurantDetail } from "types/types";
import { useQuery } from "@tanstack/react-query";
import { getRestaurantDetail } from "utils/ApiManager";

// Fixed: Use ItemAddon instead of CustomizationOption and handle string price conversion
const calculatePrice = (
  basePrice: number,
  quantity: number,
  selectedOptions: ItemAddon[] | null
): number => {
  const customizationPrice = (selectedOptions ?? []).reduce(
    (acc, curr) => acc + Number(curr?.price || 0),
    0
  );

  const finalPrice =
    (Number(basePrice) + customizationPrice) * Number(quantity);
  return finalPrice;
};

const CustomizableModal = ({
  restaurant,
}: {
  restaurant: RestaurantDetail;
}) => {
  const { addonsModalRef } = useSharedState();
  const { bottom } = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(1);
  const { initializeCustomizableItem, activeAddonsMenuId } = useSharedState();
  const dispatch = useDispatch();
  const [selectedAddons, setSelectedAddons] = useState<ItemAddon[] | null>(
    null
  );

  const menuItem = restaurant.menuItems.find(
    (item) => item.id === activeAddonsMenuId
  );

  const onAddToCartPress = () => {
    if (!menuItem) return;
    dispatch(
      addItemToCart({
        item: {
          ...menuItem,
          quantity: quantity,

          addons: selectedAddons ? selectedAddons : [],
          cartPrice: calculatePrice(menuItem.price, quantity, selectedAddons),
          price:
            calculatePrice(menuItem.price, quantity, selectedAddons) / quantity,
        },
        restaurant: restaurant,
      })
    );
    addonsModalRef.current?.dismiss();
  };

  const renderAddons = ({
    item,
    index,
  }: {
    item: ItemAddon;
    index: number;
  }) => {
    const alreadySelected =
      selectedAddons?.some((option) => option.id === item.id) ?? false;

    return (
      <OptionItems
        key={item.id || index}
        item={item}
        isSelected={alreadySelected}
        onPress={(selectedItem: ItemAddon) => {
          if (!alreadySelected) {
            if (selectedAddons && selectedAddons?.length > 0) {
              setSelectedAddons([...selectedAddons, selectedItem]);
            } else {
              setSelectedAddons([selectedItem]);
            }
          } else {
            const filteredItem = selectedAddons?.filter(
              (option) => option.id != selectedItem.id
            );
            if (filteredItem) {
              setSelectedAddons(filteredItem);
            }
          }
        }}
      />
    );
  };

  return (
    <BottomSheetModal
      ref={addonsModalRef}
      onChange={(value) => {
        if (value === -1) {
          setSelectedAddons(null);
          setQuantity(1);
        }
      }}
      backdropComponent={ModalBackdrop}
    >
      <BottomSheetView
        style={{
          paddingBottom: bottom,
          paddingHorizontal: 0,
          backgroundColor: "#f8f9fa",
          maxHeight: RFValue(500),
        }}
      >
        {menuItem && (
          <>
            <Header item={menuItem} />

            {/* Fixed: Only render addons section if addons exist */}
            {menuItem.addons && (
              <View
                style={{
                  marginHorizontal: PADDING_HORIZONTAL,
                  marginVertical: PADDING_HORIZONTAL,
                  backgroundColor: "white",
                  borderRadius: 10,
                  shadowColor: "#111",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.07,
                  shadowRadius: 1,
                  elevation: 5,
                  marginBottom: RFValue(50),
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
                    fontFamily="gilroyBold"
                    color={COLORS.black}
                  >
                    Addons
                  </CustomText>
                </View>
                <DashedLine />
                <FlatList
                  data={menuItem.addons}
                  keyExtractor={(item, index) => item.id || index.toString()} // Fixed: Use item.id if available
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    marginVertical: PADDING_HORIZONTAL,
                    gap: PADDING_HORIZONTAL,
                  }}
                  renderItem={renderAddons}
                />
              </View>
            )}

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
                  borderRadius: 14,
                  backgroundColor: "#effef5",
                }}
              >
                <View
                  style={{
                    flex: 1,
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
                    disabled={quantity === 1}
                    onPress={() => {
                      setQuantity((prev) => prev - 1);
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

                  <CustomText
                    variant="h4"
                    fontFamily="gilroyBold"
                    color="white"
                  >
                    {quantity}
                  </CustomText>

                  <TouchableOpacity
                    onPress={() => {
                      setQuantity((prev) => prev + 1);
                    }}
                    style={{
                      height: "100%",
                      paddingHorizontal: RFValue(6),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Entypo name="plus" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

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
                <CustomText variant="h6" color="white">
                  Add item to cart ₹
                  {calculatePrice(menuItem.price, quantity, selectedAddons)}
                </CustomText>
              </TouchableOpacity>
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default CustomizableModal;

const OptionItems = memo(
  ({
    item,
    onPress,
    isSelected,
  }: {
    item: ItemAddon;
    onPress: (item: ItemAddon) => void;
    isSelected?: boolean;
  }) => {
    return (
      <View
        style={{
          paddingHorizontal: PADDING_HORIZONTAL,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: item.isAvailable ? 1 : 0.5, // Fixed: Visual indication for unavailable items
        }}
      >
        <View style={{ flex: 1 }}>
          <CustomText variant="h6">{item.name}</CustomText>
          {!item.isAvailable && (
            <CustomText variant="h7" color={COLORS.gray}>
              Currently unavailable
            </CustomText>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <CustomText variant="h6">₹{item.price}</CustomText>
          <TouchableOpacity
            activeOpacity={item.isAvailable ? 0.8 : 1} // Fixed: Disable interaction for unavailable items
            onPress={() => onPress(item)}
            disabled={!item.isAvailable}
            style={{
              height: 18,
              aspectRatio: 1,
              borderRadius: 100,
              borderWidth: BORDER_WIDTH,
              borderColor: item.isAvailable ? COLORS.primary : COLORS.gray,
            }}
          >
            {isSelected && item.isAvailable && (
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
  }
);

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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Image
        style={{ height: RFValue(40), aspectRatio: 1, borderRadius: 10 }}
        source={{ uri: item.imageUrl }}
      />
      <View style={{ flex: 1 }}>
        <CustomText variant="h6">{item.name}</CustomText>
      </View>
      <View
        style={{
          flexDirection: "row",
          borderWidth: BORDER_WIDTH,
          borderColor: COLORS.gray,
          borderRadius: 100,
          padding: 5,
        }}
      >
        <Feather name="bookmark" size={RFValue(12)} color={COLORS.darkGray} />
      </View>
    </View>
  );
};
