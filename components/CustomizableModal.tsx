import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  memo,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { Entypo, Feather } from "@expo/vector-icons";
import DashedLine from "./DashedLine";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, selectRestaurantCartItem } from "redux/slice/cartSlice";
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
  const {
    setSelectedCustomisableItem,
    selectedCustomisableItem,
    initializeCustomisableItem,
  } = useSharedState();
  const cart = useSelector(selectRestaurantCartItem(restaurant.id, item.id));

  return (
    <BottomSheetModal
      ref={modalRef}
      onChange={(value) => {
        if (value === -1) {
          initializeCustomisableItem(0);
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
              borderRadius: 14,
              // borderWidth: BORDER_WIDTH,
              // borderColor: COLORS.primary,
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
                disabled={selectedCustomisableItem.quantity == 1}
                onPress={() => {
                  if (selectedCustomisableItem.quantity == 1) return;
                  setSelectedCustomisableItem((prev) => ({
                    ...prev,
                    price: prev.price - item.price,
                    quantity: prev.quantity - 1,
                  }));
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

              <CustomText variant="h4" fontFamily="aeonikBold" color="white">
                {selectedCustomisableItem.quantity}
              </CustomText>
              <TouchableOpacity
                onPress={() => {
                  setSelectedCustomisableItem((prev) => ({
                    ...prev,
                    price: prev.price + item.price,
                    quantity: prev.quantity + 1,
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
            <CustomText variant="h6" color={"white"}>
              Add item to cart ₹{selectedCustomisableItem.price}
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
    if (!exists) {
      console.log("Adding Item");
      setSelectedCustomisableItem((prev) => ({
        ...prev,
        price: selectedCustomisableItem.price + item.price,
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
        price: selectedCustomisableItem.price - item.price,
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
