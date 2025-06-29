import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
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
import Divider from "components/Divider";
import { useDispatch, useSelector } from "react-redux";
import { addToOrderHistory } from "redux/slice/orderHistorySlice";
import CustomHeader, { headerHeight } from "components/CustomHeader";
import {
  addItemToCart,
  removeAllItemFromRestaurant,
  removeItemFromCart,
  selectCart,
  selectRestaurantCart,
} from "redux/slice/cartSlice";
import {
  CartItem,
  OrderData,
  OrderItem,
  Restaurant,
  RestaurantCart,
} from "types/types";
import { RootState } from "redux/store";
import io, { Socket } from "socket.io-client";
import { useSocket } from "utils/CustomHook/useSocket";
import { useSharedState } from "context/sharedContext";
import { useAuth } from "@clerk/clerk-expo";
import { selectUser } from "redux/slice/userSlice";
import { placeOrder } from "utils/ApiManager";
const _boxBorderRadius = 14;
const otherCharges = 56.34;

const Cart = () => {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const userInformation = useSelector(selectUser);
  const { carts } = useSelector((state: RootState) => state.cart);
  const { userId } = useAuth();
  const { socketClient } = useSharedState();
  const [placingOrder, setPlacingOrder] = useState(false);
  // Find cart data for the specific restaurant
  const cartData: RestaurantCart | undefined = carts.find(
    (item) => item.restaurant.id === restaurantId
  );

  const [selectedTip, setSelectedTip] = useState<null | number>(null);

  const dispatch = useDispatch();

  if (!cartData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CustomText variant="h6">No items in cart</CustomText>
      </View>
    );
  }
  const deliveryCharges = Number(cartData.restaurant.deliveryFee) || 0;

  const cartItemPrice = cartData.items.reduce((acc, curr) => {
    return acc + Number(curr.cartPrice || 0);
  }, 0);

  const totalAmount =
    cartItemPrice + otherCharges + deliveryCharges + (selectedTip || 0);
  const toPay = totalAmount.toFixed(2);

  function convertCartToOrderData(
    cartItems: CartItem[],
    userId: string,
    addressId: string
  ): OrderData {
    const restaurantId = cartItems[0].restaurantId;

    const items: OrderItem[] = cartItems.map((item) => {
      if (!item.id) {
        throw new Error("Menu item ID is missing");
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new Error(`Invalid quantity for item ${item.id}`);
      }

      const orderItem: OrderItem = {
        menuItemId: item.id,
        quantity: item.quantity,
      };

      if (item.addons && item.addons.length > 0) {
        orderItem.addons = item.addons.map((addon) => {
          if (!addon.id) {
            throw new Error("Addon ID is missing");
          }
          return addon.id;
        });
      }

      return orderItem;
    });

    return {
      userId,
      restaurantId,
      addressId,
      items,
      deliveryTip: selectedTip || 0,
      otherCharges: otherCharges,
    };
  }
  const paymentHandler = async () => {
    try {
      if (userInformation) {
        setPlacingOrder(true);
        const orderInfo = convertCartToOrderData(
          cartData.items,
          userInformation?.id,
          userInformation?.addresses[0].id
        );

        const response = await placeOrder(orderInfo);

        console.log(JSON.stringify(response, null, 2));

        if (response.success) {
          setPlacingOrder(false);
          router.back();
          dispatch(
            addToOrderHistory({
              order: response.order,
            })
          );

          socketClient?.emit("new_order", {
            customerId: userId,
            restaurantOwnerId: cartData.restaurant.ownerId,
            orderId: response.order.id,
          });

          router.replace({
            pathname: "/orderPlacedScreen",
            params: {
              orderId: response.order.id,
            },
          });
        }
      } else {
        router.navigate("/(protected)/createUserInformationScreen");
      }
    } catch (err) {
      console.log(err);
      setPlacingOrder(false);
    }
  };

  return (
    <View style={{ backgroundColor: "#eceff2", flex: 1 }}>
      <StatusBar animated={true} style="dark" />
      <PaymentSection
        selectedTip={selectedTip || 0}
        totalPrice={cartItemPrice}
        onPayButtonPress={paymentHandler}
        totalAmountToPay={toPay}
        placingOrder={placingOrder}
      />
      <CustomHeader title={cartData.restaurant.name} />

      <ScrollView
        contentContainerStyle={{
          gap: RFValue(10),
          padding: PADDING_HORIZONTAL,
          paddingBottom: RFValue(120),
        }}
      >
        <RenderCartItemSection
          cartItems={cartData.items}
          restaurant={cartData.restaurant}
        />
        <CouponsSection />
        <DeliveryInstructionSection
          selectedTip={selectedTip}
          setSelectedTip={setSelectedTip}
        />
        <BillSection
          totalPrice={cartItemPrice}
          selectedTip={selectedTip || 0}
          totalAmountToPay={toPay}
          deliveryFee={deliveryCharges}
        />
      </ScrollView>
    </View>
  );
};

export default Cart;

const PaymentSection = ({
  totalPrice,
  selectedTip = 0,
  onPayButtonPress,
  totalAmountToPay,
  placingOrder,
}: {
  totalPrice: number;
  selectedTip: number;
  onPayButtonPress: () => void;
  totalAmountToPay: string;
  placingOrder: boolean;
}) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        zIndex: 100,
        width: "100%",
        bottom: 0,
        backgroundColor: "white",
        padding: PADDING_HORIZONTAL,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: RFValue(16),
        paddingBottom: bottom + RFValue(10),
      }}
    >
      <View style={{ flex: 1, gap: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              borderWidth: BORDER_WIDTH,
              borderColor: COLORS.liteGray,
              padding: 3,
              borderRadius: 10,
            }}
          >
            <Image
              source={require("assets/images/gpay.png")}
              style={{ height: RFValue(14), aspectRatio: 1 }}
            />
          </View>
          <CustomText
            variant="h6"
            color={COLORS.darkGray}
            style={{ textTransform: "uppercase" }}
          >
            Pay using
          </CustomText>
          <AntDesign
            name="caretup"
            color={COLORS.darkGray}
            size={RFValue(10)}
          />
        </View>
        <CustomText variant="h6" fontFamily="gilroySemiBold">
          Google Pay
        </CustomText>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPayButtonPress}
        disabled={placingOrder}
        style={{
          height: RFValue(40),
          paddingHorizontal: RFValue(30),
          backgroundColor: COLORS.primary,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          minWidth: screenWidth * 0.4,
        }}
      >
        <View style={{ alignItems: "center" }}>
          {placingOrder ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <CustomText
              variant="h4"
              fontFamily="gilroyBold"
              color="white"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              ₹{totalAmountToPay}
            </CustomText>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const BillSection = ({
  totalPrice,
  selectedTip = 0,
  totalAmountToPay,
  deliveryFee,
}: {
  totalPrice: number;
  selectedTip: number;
  totalAmountToPay: string;
  deliveryFee: number;
}) => {
  return (
    <View
      style={{
        paddingVertical: PADDING_HORIZONTAL,
        backgroundColor: "white",
        borderRadius: _boxBorderRadius,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          paddingHorizontal: PADDING_HORIZONTAL,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.primary,
            padding: RFValue(4),
            borderRadius: 4,
            alignSelf: "flex-start",
          }}
        >
          <FontAwesome5 name="receipt" size={RFValue(8)} color="white" />
        </View>
        <View style={{ gap: 4 }}>
          <CustomText
            variant="h7"
            fontFamily="gilroyMedium"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            To Pay ₹{totalAmountToPay}{" "}
          </CustomText>
          <CustomText variant="h7" color={COLORS.darkGray}>
            Incl. all taxes & charges
          </CustomText>
        </View>
        <AntDesign
          name="up"
          size={RFValue(10)}
          style={{ marginLeft: "auto" }}
        />
      </View>
      <Divider style={{ marginVertical: 14 }} />

      <View style={{ paddingHorizontal: PADDING_HORIZONTAL, gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomText variant="h7" color={COLORS.darkGray}>
            Item Total
          </CustomText>
          <CustomText variant="h7" fontFamily="gilroyMedium">
            ₹{totalPrice.toFixed(2)}
          </CustomText>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomText variant="h7" color={COLORS.darkGray}>
            Delivery Fee | 7 Kms
          </CustomText>
          <CustomText variant="h7" fontFamily="gilroyMedium">
            ₹{deliveryFee.toFixed(2)}
          </CustomText>
        </View>
      </View>
      <DashedLine
        style={{ backgroundColor: COLORS.darkGray, marginVertical: 14 }}
      />
      <View style={{ paddingHorizontal: PADDING_HORIZONTAL, gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomText variant="h7" color={COLORS.darkGray}>
            Delivery Tip
          </CustomText>
          <CustomText
            variant="h7"
            fontFamily="gilroyMedium"
            color={selectedTip ? "black" : COLORS.primary}
          >
            {selectedTip ? `₹${selectedTip}.00` : "Add tip"}
          </CustomText>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomText variant="h7" color={COLORS.darkGray}>
            GST & Other Charges
          </CustomText>
          <CustomText variant="h7" fontFamily="gilroyMedium">
            ₹{otherCharges.toFixed(2)}
          </CustomText>
        </View>
      </View>
      <DashedLine
        style={{ backgroundColor: COLORS.darkGray, marginVertical: 14 }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: PADDING_HORIZONTAL,
        }}
      >
        <CustomText
          variant="h7"
          color={COLORS.darkGray}
          fontFamily="gilroyBold"
        >
          To Pay
        </CustomText>
        <CustomText
          variant="h7"
          fontFamily="gilroyBold"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          ₹{totalAmountToPay}
        </CustomText>
      </View>
    </View>
  );
};

interface RenderCartItemSectionProp {
  cartItems: CartItem[];
  restaurant: Restaurant;
}

const RenderCartItemSection: React.FC<RenderCartItemSectionProp> = ({
  cartItems,
  restaurant,
}) => {
  const dispatch = useDispatch();

  const totalCartItems = useMemo(() => {
    return cartItems.reduce((curr, acc) => {
      return curr + acc.quantity;
    }, 0);
  }, [cartItems]);

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
          // Create unique key combining item id and addons
          const addonIds =
            item.addons?.map((addon) => addon.id).join("-") || "no-addons";
          const uniqueKey = `${item.id}_${addonIds}_${index}`;

          return (
            <View
              key={uniqueKey}
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
                      item.isVegetarian
                        ? require("assets/images/vegIcon.png")
                        : require("assets/images/nonvegIcon.png")
                    }
                  />
                  <CustomText variant="h7" fontFamily="gilroyMedium">
                    {item.name}
                  </CustomText>
                </View>
                {/* Display addons if they exist */}
                {item.addons && item.addons.length > 0 && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {item.addons.map((addon, addonIndex) => {
                      return (
                        <CustomText
                          key={addon.id}
                          variant="h7"
                          fontSize={RFValue(7)}
                          color={COLORS.darkGray}
                        >
                          {addon.name}
                          {addonIndex !== item.addons!.length - 1 ? " + " : " "}
                        </CustomText>
                      );
                    })}
                  </View>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "space-evenly",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CustomText
                    variant="h7"
                    style={{ fontVariant: ["tabular-nums"] }}
                  >
                    ₹{Number(item.cartPrice).toFixed(2)}
                  </CustomText>
                </View>
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
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(
                        removeItemFromCart({
                          restaurant: restaurant,
                          item: {
                            ...item,
                          },
                        })
                      );

                      if (totalCartItems <= 1) {
                        router.back();
                      }
                    }}
                    activeOpacity={0.8}
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
                  </TouchableOpacity>
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
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      dispatch(
                        addItemToCart({
                          restaurant: restaurant,
                          item: {
                            ...item,
                            quantity: 1,
                          },
                        })
                      );
                    }}
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
                  </TouchableOpacity>
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
        <TouchableOpacity
          onPress={() => {
            // Navigate back to menu to add more items
            router.back();
          }}
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
        </TouchableOpacity>
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

      <TouchableOpacity
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
      </TouchableOpacity>
    </View>
  );
};

const DeliveryInstructionSection = ({
  selectedTip,
  setSelectedTip,
}: {
  selectedTip: null | number;
  setSelectedTip: (value: null | number) => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState(
    deliveryType[0]
  );

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
                key={index}
                activeOpacity={0.8}
                onPress={() => setSelectedDeliveryType(item)}
              >
                <View
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
                      />
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
                {index !== deliveryType.length - 1 && (
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
            rider's spirits and keeps them going.
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
                  key={index}
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
                    <Pressable
                      onPress={() => setSelectedTip(null)}
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
                    </Pressable>
                  )}
                  {item === 30 && selectedTip !== item && (
                    <View
                      style={{
                        backgroundColor: COLORS.primary,
                        width: "100%",
                        alignSelf: "flex-end",
                        justifyContent: "center",
                        alignItems: "center",
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
                <TouchableOpacity
                  key={index}
                  style={{
                    borderWidth: BORDER_WIDTH,
                    width: screenWidth * 0.25,
                    padding: PADDING_HORIZONTAL,
                    gap: 20,
                    borderRadius: 10,
                    borderColor: COLORS.gray,
                  }}
                >
                  <View>{item.icon}</View>
                  <View>
                    <CustomText
                      variant="h7"
                      fontFamily="gilroySemiBold"
                      color={COLORS.darkGray}
                    >
                      {item.title}
                    </CustomText>
                  </View>
                </TouchableOpacity>
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

const styles = StyleSheet.create({});
