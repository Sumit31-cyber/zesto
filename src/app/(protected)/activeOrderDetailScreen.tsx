import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { headerHeight } from "components/CustomHeader";
import {
  COLORS,
  PADDING_HORIZONTAL,
  screenHeight,
  screenWidth,
} from "utils/constants";
import { RFValue } from "react-native-responsive-fontsize";
import { router, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import CustomText from "components/customText";
import { LinearGradient } from "expo-linear-gradient";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { useSelector } from "react-redux";
import { getUserInformation } from "utils/ApiManager";
import { selectUser } from "redux/slice/userSlice";
import { Check, Home } from "lucide-react-native";
import { selectOrder, selectOrderHistory } from "redux/slice/orderHistorySlice";
import { RootState } from "redux/store";
import { OrderHistory, OrderHistoryItemTypes } from "types/types";
import dayjs from "dayjs";
import MapViewDirections from "react-native-maps-directions";
import { decode } from "@mapbox/polyline";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import DashedLine from "components/DashedLine";
interface Coords {
  latitude: number;
  longitude: number;
}

const ActiveOrderDetailScreen = () => {
  const { top } = useSafeAreaInsets();
  const userInformation = useSelector(selectUser);
  const [cords, setCords] = useState<Coords[] | null>(null);
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const order = useSelector((state: RootState) => selectOrder(state, orderId));
  const bottomSheetPosition = useSharedValue(0);

  const bottomSheetModalRef = useRef<BottomSheet>(null);

  const startLoc = [
    order?.restaurant.address.latitude,
    order?.restaurant.address.longitude,
  ];
  const destinationLoc = [
    userInformation?.addresses[0].latitude,
    userInformation?.addresses[0].longitude,
  ];
  const getDirections = async (startLoc: any, destinationLoc: any) => {
    try {
      const KEY = process.env.EXPO_PUBLIC_GO_MAPS_KEY; //put your API key here.
      //otherwise, you'll have an 'unauthorized' error.
      let resp = await fetch(
        `https://maps.gomaps.pro/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`
      );

      let respJson = await resp.json();
      console.log(respJson);
      let points = decode(respJson.routes[0].overview_polyline.points);
      console.log(points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });

      console.log(coords);
      setCords(coords);
      return coords;
    } catch (error) {
      return error;
    }
  };

  const rMapHeight = useAnimatedStyle(() => {
    return {
      height: bottomSheetPosition.value,
    };
  }, []);

  // useEffect(() => {
  //   getDirections(startLoc, destinationLoc);
  // }, []);

  const initialRegion: Region = {
    //@ts-ignore
    latitude: userInformation?.addresses[0].latitude,
    //@ts-ignore
    longitude: userInformation?.addresses[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const restaurantCoordinates: Region = {
    //@ts-ignore
    latitude: order?.restaurant.address.latitude,
    //@ts-ignore
    longitude: order?.restaurant.address.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const userCoordinates: Region = {
    //@ts-ignore
    latitude: userInformation?.addresses[0].latitude,
    //@ts-ignore
    longitude: userInformation?.addresses[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const polylinesCoordinates = [
    {
      latitude: userInformation?.addresses[0].latitude,
      longitude: userInformation?.addresses[0].longitude,
    },
    {
      latitude: order?.restaurant.address.latitude,
      longitude: order?.restaurant.address.longitude,
    },
  ];

  const getCurrentStatusInfo = () => {
    switch (order?.status.toLowerCase()) {
      case "pending":
        return {
          status: "Order Pending",
          desc: "Your order has been placed and is awaiting confirmation.",
        };
      case "confirmed":
        return {
          status: "Order Confirmed",
          desc: "The restaurant has confirmed your order and will start preparing it shortly.",
        };
      case "preparing":
        return {
          status: "Preparing Order",
          desc: "The restaurant is currently preparing your order.",
        };
      case "ready_for_pickup":
        return {
          status: "Ready for Pickup",
          desc: "Delivery agent is on the way to pickup your order from the restaurant",
        };
      default:
        return {
          status: "Unknown Status",
          desc: "We couldn't determine the current status of your order.",
        };
    }
  };

  const calculateItemTotal = () => {
    return (
      order?.items.reduce((total, item) => {
        return total + parseFloat(item.totalItemPrice);
      }, 0) || 0
    );
  };

  if (!order) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.grayBackgroundColor }}>
      <Header order={order} />
      <LinearGradient
        colors={[
          "rgba(236, 239, 242,1)",
          "rgba(236, 239, 242,1)",
          "rgba(236, 239, 242,1)",
          "rgba(236, 239, 242,0.1)",
        ]}
        style={{
          height: headerHeight * 2.5 + top,
          width: screenWidth,
          position: "absolute",
          zIndex: 1,
        }}
      ></LinearGradient>
      <View
        style={{
          height: screenHeight - headerHeight * 2.5,
          width: screenWidth,
          marginTop: headerHeight * 2,
          borderBottomLeftRadius: RFValue(12),
          borderBottomRightRadius: RFValue(12),
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={[
            rMapHeight,
            {
              width: screenWidth,
              backgroundColor: COLORS.primary,
              // position: "absolute",
            },
          ]}
        >
          <MapView
            showsUserLocation
            showsMyLocationButton
            //   provider={PROVIDER_GOOGLE}
            initialRegion={restaurantCoordinates}
            style={{ flex: 1 }}
            onPress={() => {}}
          >
            <Marker coordinate={restaurantCoordinates}>
              <Image
                contentFit="contain"
                source={require("assets/images/riderImage.png")}
                style={{
                  height: RFValue(40),
                  aspectRatio: 1,
                }}
              />
            </Marker>
            <Marker coordinate={userCoordinates}>
              <View
                style={{
                  height: RFValue(20),
                  aspectRatio: 1,
                  backgroundColor: COLORS.primary,
                  borderRadius: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Home color={"white"} size={RFValue(12)} />
              </View>
            </Marker>
            {cords && (
              <Polyline
                coordinates={cords}
                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                strokeColors={[COLORS.primary]}
                strokeWidth={2}
              />
            )}
          </MapView>
        </Animated.View>

        <BottomSheet
          ref={bottomSheetModalRef}
          snapPoints={[screenHeight * 0.2, screenHeight * 0.5]}
          animatedPosition={bottomSheetPosition}
          index={0}
          enablePanDownToClose={false}
          backgroundStyle={{
            backgroundColor: "transparent",
          }}
          handleStyle={{
            overflow: "hidden",
            height: 0,

            borderTopLeftRadius: 100,
            borderTopRightRadius: 100,
          }}
          handleIndicatorStyle={{ backgroundColor: "transparent", height: 0 }}
        >
          <BottomSheetScrollView
            bounces={false}
            contentContainerStyle={{ gap: RFValue(10) }}
          >
            <LinearGradient
              colors={[
                "rgba(236, 239, 242,0.4)",
                "rgba(236, 239, 242,0.95)",
                "rgba(236, 239, 242,1)",
              ]}
              style={{
                width: screenWidth,
                bottom: 0,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  marginHorizontal: PADDING_HORIZONTAL,
                  borderRadius: RFValue(12),
                  padding: PADDING_HORIZONTAL,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, gap: 8 }}>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <Check strokeWidth={4} color={COLORS.primary} />
                      <CustomText
                        variant="h5"
                        fontFamily="gilroyBold"
                        color={COLORS.primary}
                      >
                        ON TIME
                      </CustomText>
                    </View>
                    <CustomText variant="h5" fontFamily="gilroyBold">
                      {getCurrentStatusInfo().status}
                    </CustomText>
                    <CustomText variant="h6" color={COLORS.extraDarkGray}>
                      {getCurrentStatusInfo().desc}
                    </CustomText>
                  </View>
                  <View
                    style={{
                      height: RFValue(40),
                      aspectRatio: 1,
                      backgroundColor: COLORS.primary,
                      borderRadius: RFValue(8),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CustomText
                      variant="h5"
                      color="white"
                      fontFamily="gilroySemiBold"
                    >
                      30
                    </CustomText>
                    <CustomText variant="h6" color="white">
                      mins
                    </CustomText>
                  </View>
                </View>
              </View>
            </LinearGradient>

            {/* Bill Details */}
            <View style={styles.billSection}>
              <CustomText
                variant="h7"
                fontFamily="gilroySemiBold"
                style={styles.billTitle}
                color={COLORS.primary}
              >
                BILL DETAILS
              </CustomText>

              {/* Items */}
              {order.items.map((item, index) => (
                <View key={item.id} style={styles.billItem}>
                  <View style={styles.itemInfo}>
                    <Image
                      style={{ height: RFValue(12), aspectRatio: 1 }}
                      source={
                        item.menuItem.isVegetarian
                          ? require("assets/images/vegIcon.png")
                          : require("assets/images/nonvegIcon.png")
                      }
                    />
                    <CustomText
                      variant="h7"
                      color={COLORS.extraDarkGray}
                      style={styles.itemName}
                    >
                      {item.menuItem.name} x {item.quantity}
                    </CustomText>
                  </View>
                  <CustomText
                    variant="h7"
                    color={COLORS.extraDarkGray}
                    style={styles.itemPrice}
                  >
                    ₹{item.totalItemPrice}
                  </CustomText>
                </View>
              ))}

              <DashedLine style={{ marginVertical: RFValue(10) }} />

              {/* Totals */}
              <View style={styles.billRow}>
                <CustomText variant="h7" color={COLORS.extraDarkGray}>
                  Item Total
                </CustomText>
                <CustomText variant="h7" color={COLORS.extraDarkGray}>
                  ₹{calculateItemTotal().toFixed(2)}
                </CustomText>
              </View>

              <View style={styles.billRow}>
                <CustomText variant="h7" color={COLORS.extraDarkGray}>
                  Order Packing Charges
                </CustomText>
                <CustomText variant="h7" color={COLORS.extraDarkGray}>
                  ₹45.00
                </CustomText>
              </View>

              <View style={styles.billRow}>
                <CustomText color={COLORS.extraDarkGray} variant="h7">
                  Delivery partner fee
                </CustomText>
                <CustomText variant="h7" color={COLORS.extraDarkGray}>
                  ₹0
                </CustomText>
              </View>

              <DashedLine style={{ marginVertical: RFValue(10) }} />

              <View style={styles.billRow}>
                <CustomText
                  variant="h7"
                  fontFamily="gilroyMedium"
                  color={COLORS.extraDarkGray}
                >
                  Paid Via UPI
                </CustomText>
                <View style={styles.totalSection}>
                  <CustomText
                    variant="h7"
                    fontFamily="gilroySemiBold"
                    color={COLORS.extraDarkGray}
                  >
                    Bill Total
                  </CustomText>
                  <CustomText
                    variant="h7"
                    fontFamily="gilroySemiBold"
                    color={COLORS.extraDarkGray}
                  >
                    ₹{order.total}
                  </CustomText>
                </View>
              </View>
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </View>
  );
};

export default ActiveOrderDetailScreen;

const styles = StyleSheet.create({
  billSection: {
    backgroundColor: "white",
    marginHorizontal: PADDING_HORIZONTAL,
    padding: PADDING_HORIZONTAL,
    borderRadius: RFValue(12),
  },
  billTitle: {
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: RFValue(2),
  },
  itemIndicator: {
    width: 12,
    height: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
    marginRight: 8,
    marginTop: 2,
  },
  itemName: {
    flex: 1,
    lineHeight: 18,
  },
  itemPrice: {
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  discount: {
    color: "#4CAF50",
  },
  totalSection: {
    alignItems: "flex-end",
  },

  conversationSection: {
    backgroundColor: "white",
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
  },
  conversationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  conversationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  conversationText: {
    fontSize: 14,
    color: "#333",
  },
  conversationArrow: {
    fontSize: 18,
    color: "#666",
  },
  conversationSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  closedIndicator: {
    marginTop: 12,
  },
  closedText: {
    fontSize: 12,
    color: "#666",
  },
});

const Header = ({ order }: { order: OrderHistory }) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: top,
        height: headerHeight + top,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: PADDING_HORIZONTAL,
        flexDirection: "row",
        gap: RFValue(8),
        position: "absolute",
        zIndex: 2,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          router.back();
        }}
        style={{
          aspectRatio: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AntDesign name="arrowleft" size={RFValue(16)} color="black" />
      </TouchableOpacity>

      <View style={{ width: "90%" }}>
        <View
          style={{
            alignSelf: "center",
            marginRight: RFValue(16),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CustomText variant="h6" fontFamily="gilroySemiBold">
            {order.restaurant.name}
          </CustomText>
          <CustomText color={COLORS.extraDarkGray} variant="h7">
            {dayjs(order.createdAt).format("h:mm A")} , {order.items.length}{" "}
            item{order.items.length > 1 ? "s" : ""}
          </CustomText>
        </View>
      </View>
    </View>
  );
};
