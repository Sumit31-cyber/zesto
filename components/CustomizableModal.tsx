import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { memo, RefObject, useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useSharedState } from "context/sharedContext";
import ModalBackdrop from "./ModalBackdrop";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomizationOption } from "utils/dataObject";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BORDER_WIDTH, COLORS, PADDING_HORIZONTAL } from "utils/constants";
import CustomText from "./customText";
import { Entypo, Feather } from "@expo/vector-icons";
import DashedLine from "./DashedLine";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { selectRestaurantCartItem } from "redux/slice/cartSlice";
import {
  ItemAddon,
  MenuItem,
  RecommendedRestaurantDataTypes,
  Restaurant,
} from "types/types";

const calculatePrice = (
  basePrice: number,
  quantity: number,
  selectedOptions: CustomizationOption[]
) => {
  const customizationPrice = selectedOptions.reduce(
    (acc, curr) => acc + curr.price,
    0
  );
  return (basePrice + customizationPrice) * quantity;
};

const CustomizableModal = ({
  menuItem,
  modalRef,
  onAddToCartPress,
  restaurant,
}: {
  menuItem: MenuItem;
  modalRef: RefObject<BottomSheetModal>;
  onAddToCartPress: () => void;
  restaurant: Restaurant;
}) => {
  const { bottom } = useSafeAreaInsets();
  const {
    selectedCustomizableItem,
    setSelectedCustomizableItem,
    initializeCustomizableItem,
  } = useSharedState();

  const cart = useSelector(
    selectRestaurantCartItem(restaurant.id, menuItem.id)
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      onChange={(value) => {
        if (value === -1) {
          initializeCustomizableItem(0);
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
        <Header item={menuItem} />

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
            keyExtractor={(_, index) => index.toString()}
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              marginVertical: PADDING_HORIZONTAL,
              gap: PADDING_HORIZONTAL,
            }}
            renderItem={({ item, index }) => (
              <>
                <OptionItems key={index} item={item} menuItem={menuItem} />
              </>
            )}
          />
        </View>

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
                disabled={selectedCustomizableItem.quantity === 1}
                onPress={() => {
                  if (selectedCustomizableItem.quantity > 1) {
                    const updatedQuantity =
                      selectedCustomizableItem.quantity - 1;
                    setSelectedCustomizableItem((prev) => ({
                      ...prev,
                      quantity: updatedQuantity,
                      price: calculatePrice(
                        menuItem.price,
                        updatedQuantity,
                        prev.selectedOptions
                      ),
                    }));
                  }
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

              <CustomText variant="h4" fontFamily="gilroyBold" color="white">
                {selectedCustomizableItem.quantity}
              </CustomText>

              <TouchableOpacity
                onPress={() => {
                  const updatedQuantity = selectedCustomizableItem.quantity + 1;
                  setSelectedCustomizableItem((prev) => ({
                    ...prev,
                    quantity: updatedQuantity,
                    price: calculatePrice(
                      menuItem.price,
                      updatedQuantity,
                      prev.selectedOptions
                    ),
                  }));
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
              Add item to cart ₹{selectedCustomizableItem.price}
            </CustomText>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default CustomizableModal;

const OptionItems = memo(
  ({ item, menuItem }: { item: ItemAddon; menuItem: MenuItem }) => {
    const { selectedCustomizableItem, setSelectedCustomizableItem } =
      useSharedState();

    const exists = useMemo(() => {
      return selectedCustomizableItem.selectedOptions.some(
        (option) => option.name === item.name
      );
    }, [selectedCustomizableItem.selectedOptions, item.name]);

    const handleSelection = () => {
      // if (!exists) {
      //   const updatedOptions = [
      //     item,
      //     ...selectedCustomizableItem.selectedOptions,
      //   ];
      //   setSelectedCustomizableItem((prev) => ({
      //     ...prev,
      //     selectedOptions: updatedOptions,
      //     price: calculatePrice(menuItem.price, prev.quantity, updatedOptions),
      //   }));
      // } else {
      //   const updatedOptions = selectedCustomizableItem.selectedOptions.filter(
      //     (opt) => opt.name !== item.name
      //   );
      //   setSelectedCustomizableItem((prev) => ({
      //     ...prev,
      //     selectedOptions: updatedOptions,
      //     price: calculatePrice(menuItem.price, prev.quantity, updatedOptions),
      //   }));
      // }
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
      <CustomText variant="h6">{item.name}</CustomText>
      <View
        style={{
          flexDirection: "row",
          borderWidth: BORDER_WIDTH,
          borderColor: COLORS.gray,
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
