import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { headerHeight } from "./(tabs)/favorite";
import { AntDesign } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { BORDER_WIDTH, COLORS, PADDING_HORIZONTAL } from "utils/constants";
import CustomText from "components/customText";
import { router, useLocalSearchParams } from "expo-router";
import { CartItem, RestaurantCart } from "utils/dataObject";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

const Cart = () => {
  const { cartItemData } = useLocalSearchParams<{ cartItemData: string }>();
  const parsedCartData: RestaurantCart = cartItemData
    ? JSON.parse(cartItemData)
    : {};

  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: "#eceff2", flex: 1 }}>
      <View
        style={{
          paddingTop: top,
          //   paddingTop: top,
          height: headerHeight + top,
          width: "100%",
          alignItems: "center",
          paddingHorizontal: PADDING_HORIZONTAL,
          flexDirection: "row",
          gap: RFValue(8),
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            aspectRatio: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AntDesign name="arrowleft" size={RFValue(18)} color="black" />
        </TouchableOpacity>
        <CustomText variant="h6">{parsedCartData.restaurant.name}</CustomText>
      </View>

      <RenderCartItemSection cartItems={parsedCartData.items} />
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({});

interface RenderCartItemSectionProp {
  cartItems: CartItem[];
}
const RenderCartItemSection: React.FC<RenderCartItemSectionProp> = ({
  cartItems,
}) => {
  return (
    <View
      style={{
        margin: PADDING_HORIZONTAL,
        backgroundColor: "white",
        padding: PADDING_HORIZONTAL,
        borderRadius: 14,
      }}
    >
      <View style={{ gap: RFValue(10) }}>
        {cartItems.map((item, index) => {
          return (
            <View style={{ flexDirection: "row", gap: RFValue(20) }}>
              <View style={{ flex: 1, gap: 5 }}>
                <View
                  key={item.id}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Image
                    style={{ height: RFValue(10), aspectRatio: 1 }}
                    source={
                      item.isVeg
                        ? require("assets/images/vegIcon.png")
                        : require("assets/images/nonvegIcon.png")
                    }
                  />
                  <CustomText variant="h7" fontFamily="gilroyMedium">
                    {item.name}
                  </CustomText>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {item.customizations?.map((customization, index) => {
                    return (
                      <CustomText
                        variant="h7"
                        fontSize={RFValue(7)}
                        color={COLORS.darkGray}
                      >
                        {customization.name}
                        {index !== (item.customizations?.length ?? 0) - 1
                          ? " + "
                          : " "}
                      </CustomText>
                    );
                  })}
                </View>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    height: RFValue(20),
                    borderWidth: BORDER_WIDTH,
                    borderColor: COLORS.gray,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      aspectRatio: 1,
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AntDesign
                      name="minus"
                      size={RFValue(10)}
                      color={COLORS.primary}
                    />
                  </View>
                  <View
                    style={{
                      width: RFValue(20),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CustomText variant="h7" fontFamily="gilroySemiBold">
                      {item.quantity}
                    </CustomText>
                  </View>
                  <View
                    style={{
                      aspectRatio: 1,
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AntDesign
                      name="plus"
                      size={RFValue(10)}
                      color={COLORS.primary}
                    />
                  </View>
                </View>
                <CustomText variant="h7">₹{item.price}</CustomText>
              </View>
            </View>
          );
        })}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            borderWidth: BORDER_WIDTH,
            borderColor: COLORS.gray,
            paddingVertical: RFValue(4),
            paddingHorizontal: RFValue(6),
            borderRadius: 10,
          }}
        >
          <AntDesign name="edit" size={RFValue(10)} color="black" />
          <CustomText
            variant="h7"
            fontSize={RFValue(6)}
            fontFamily="gilroySemiBold"
            color={COLORS.black}
          >
            Cooking Instructions
          </CustomText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            borderWidth: BORDER_WIDTH,
            borderColor: COLORS.gray,
            paddingVertical: RFValue(4),
            paddingHorizontal: RFValue(6),
            borderRadius: 10,
          }}
        >
          <AntDesign name="plus" size={RFValue(10)} color="black" />
          <CustomText
            variant="h7"
            fontSize={RFValue(6)}
            fontFamily="gilroySemiBold"
            color={COLORS.black}
          >
            Add More Items
          </CustomText>
        </View>
      </View>
    </View>
  );
};
