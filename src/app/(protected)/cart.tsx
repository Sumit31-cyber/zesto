import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { headerHeight } from "./(tabs)/favorite";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import {
  BORDER_WIDTH,
  COLORS,
  PADDING_HORIZONTAL,
  screenWidth,
} from "utils/constants";
import CustomText from "components/customText";
import { router, useLocalSearchParams } from "expo-router";
import { CartItem, RestaurantCart } from "utils/dataObject";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import AnimatedSegmentControl from "components/AnimatedSegmentControl";
import DashedLine from "components/DashedLine";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  ZoomIn,
  ZoomInEasyDown,
  ZoomOut,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

const _boxBorderRadius = 14;

const Cart = () => {
  const { cartItemData } = useLocalSearchParams<{ cartItemData: string }>();
  const parsedCartData: RestaurantCart = cartItemData
    ? JSON.parse(cartItemData)
    : {};

  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: "#eceff2", flex: 1 }}>
      <StatusBar animated={true} style="dark" />
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

      <View style={{ margin: PADDING_HORIZONTAL, gap: RFValue(10) }}>
        <RenderCartItemSection cartItems={parsedCartData.items} />
        <CouponsSection />
        <DeliveryInstructionSection />
      </View>
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
        backgroundColor: "white",
        padding: PADDING_HORIZONTAL,
        borderRadius: _boxBorderRadius,
      }}
    >
      <View style={{ gap: RFValue(10) }}>
        {cartItems.map((item, index) => {
          return (
            <View
              key={`${item.id}_${index}`}
              style={{
                flexDirection: "row",
                gap: RFValue(20),
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1, gap: 5 }}>
                <View
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
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "space-evenly",
                  // flex: 1,
                }}
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
                      width: RFValue(14),
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
                <View
                  style={{
                    width: screenWidth * 0.1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CustomText variant="h7">₹{item.price}</CustomText>
                </View>
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

const CouponsSection = () => {
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "white",
        padding: PADDING_HORIZONTAL,
        borderRadius: _boxBorderRadius,
      }}
    >
      <CustomText
        variant="h7"
        style={{ textTransform: "uppercase", letterSpacing: 1 }}
        fontFamily="gilroyMedium"
        color={COLORS.darkGray}
      >
        Savings Corner
      </CustomText>

      <View
        style={{
          flexDirection: "row",
          marginTop: PADDING_HORIZONTAL,
          alignItems: "center",
          gap: 10,
        }}
      >
        <View
          style={{
            height: RFValue(14),
            aspectRatio: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.primary,
            borderRadius: 2,
          }}
        >
          <AntDesign name="tag" size={RFValue(8)} color="white" />
        </View>
        <CustomText variant="h6" fontFamily="gilroyMedium">
          Apply Coupon
        </CustomText>
        <AntDesign
          name="right"
          size={RFValue(10)}
          color="black"
          style={{ marginLeft: "auto" }}
        />
      </View>
    </View>
  );
};
const DeliveryInstructionSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState(
    deliveryType[0]
  );
  const [selectedTip, setSelectedTip] = useState<null | number>(null);
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "white",
        padding: PADDING_HORIZONTAL,
        borderRadius: _boxBorderRadius,
      }}
    >
      <AnimatedSegmentControl
        activeIndex={activeIndex}
        onPress={setActiveIndex}
      />

      {activeIndex === 0 && (
        <Animated.View entering={FadeIn} style={{ marginTop: RFValue(15) }}>
          {deliveryType.map((item, index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedDeliveryType(item)}
              >
                <View
                  key={item}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      height: RFValue(12),
                      width: RFValue(12),
                      borderWidth: BORDER_WIDTH * 2,
                      borderColor:
                        selectedDeliveryType === item
                          ? COLORS.primary
                          : COLORS.gray,
                      borderRadius: 100,
                      overflow: "hidden",
                    }}
                  >
                    {selectedDeliveryType === item && (
                      <Animated.View
                        entering={ZoomIn}
                        exiting={ZoomOut}
                        style={{
                          flex: 1,
                          backgroundColor: COLORS.primary,
                          borderRadius: 100,
                        }}
                      ></Animated.View>
                    )}
                  </View>
                  <View style={{ gap: 3 }}>
                    <CustomText variant="h7" fontFamily="gilroySemiBold">
                      {item}
                    </CustomText>
                    <CustomText variant="h7" color={COLORS.gray}>
                      Add address to check delivery time
                    </CustomText>
                  </View>
                </View>
                {index != deliveryType.length - 1 && (
                  <DashedLine style={{ marginVertical: PADDING_HORIZONTAL }} />
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      )}
      {activeIndex === 1 && (
        <Animated.View
          entering={FadeIn}
          style={{
            marginTop: RFValue(15),
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <CustomText variant="h7" fontFamily="gilroyMedium">
            Delivering in the rain is tough. Your tip, big or small, boosts your
            rider's spirits and keeps then going.
          </CustomText>

          <View
            style={{
              flexDirection: "row",
              gap: 20,
              justifyContent: "space-between",
              marginTop: PADDING_HORIZONTAL,
              height: RFValue(26),
            }}
          >
            {tipsData.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => setSelectedTip(item)}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    borderWidth: BORDER_WIDTH * 2,
                    borderColor:
                      selectedTip === item ? COLORS.primary : COLORS.liteGray,
                    overflow: "hidden",
                    flexDirection: selectedTip === item ? "row" : "column",
                  }}
                >
                  <CustomText
                    variant="h7"
                    fontSize={RFValue(6.5)}
                    fontFamily="gilroyMedium"
                    style={{ paddingVertical: RFValue(2) }}
                  >
                    ₹{item}
                  </CustomText>

                  {selectedTip === item && (
                    <View
                      style={{
                        backgroundColor: COLORS.primary,
                        padding: RFValue(2),
                        marginHorizontal: 5,
                        borderRadius: 100,
                        opacity: 0.5,
                      }}
                    >
                      <AntDesign
                        name={"close"}
                        size={RFValue(7)}
                        color={"white"}
                      />
                    </View>
                  )}
                  {item === 30 && selectedTip !== item && (
                    <View
                      style={{
                        backgroundColor: COLORS.primary,
                        width: "100%",
                        alignSelf: "flex-end",
                        justifyContent: "center",
                        alignItems: "center",
                        // paddingVertical: RFValue(2),
                        flex: 1,
                      }}
                    >
                      <CustomText
                        variant="h7"
                        fontSize={RFValue(5)}
                        fontFamily="gilroyMedium"
                        color="white"
                      >
                        Most Tipped
                      </CustomText>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      )}
      {activeIndex === 2 && (
        <Animated.View
          entering={FadeIn}
          style={{
            marginTop: RFValue(15),
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <ScrollView
            horizontal
            style={{ flexDirection: "row" }}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {instructions.map((item, index) => {
              return (
                <View
                  style={{
                    borderWidth: BORDER_WIDTH,
                    width: screenWidth * 0.25,
                    padding: PADDING_HORIZONTAL,
                    gap: 20,
                    borderRadius: 10,
                    borderColor: COLORS.gray,
                  }}
                >
                  <View style={{}}>{item.icon}</View>
                  <View>
                    <CustomText
                      variant="h7"
                      fontFamily="gilroySemiBold"
                      color={COLORS.darkGray}
                    >
                      {item.title}
                    </CustomText>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const deliveryType = ["Standard", "Eco Saver"];
const tipsData = [20, 30, 50, 100];
const iconColor = COLORS.darkGray;
const iconSize = RFValue(16);
const instructions = [
  {
    title: "Avoid ringing bell",
    icon: <Feather name="bell-off" size={iconSize} color={iconColor} />,
  },
  {
    title: "Leave at the door",
    icon: (
      <MaterialCommunityIcons
        name="door-closed"
        size={iconSize}
        color={iconColor}
      />
    ),
  },
  {
    title: "Direction to reach",
    icon: (
      <SimpleLineIcons name="directions" size={iconSize} color={iconColor} />
    ),
  },
  {
    title: "Avoid calling",
    icon: <MaterialIcons name="mobile-off" size={iconSize} color={iconColor} />,
  },
  {
    title: "Leave with security",
    icon: <FontAwesome5 name="user-secret" size={iconSize} color={iconColor} />,
  },
];
