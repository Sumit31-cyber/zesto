import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
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
import MapView, { Polyline, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSelector } from "react-redux";
import { getUserInformation } from "utils/ApiManager";
import { selectUser } from "redux/slice/userSlice";
import { Check } from "lucide-react-native";
import { selectOrder, selectOrderHistory } from "redux/slice/orderHistorySlice";
import { RootState } from "redux/store";
import { OrderHistory, OrderHistoryItemTypes } from "types/types";
import dayjs from "dayjs";
import MapViewDirections from "react-native-maps-directions";

const ActiveOrderDetailScreen = () => {
  const { top } = useSafeAreaInsets();
  const userInformation = useSelector(selectUser);
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const order = useSelector((state: RootState) => selectOrder(state, orderId));

  console.log(JSON.stringify(order, null, 2));

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
  if (!order) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.grayBackgroundColor }}>
      <Header order={order} />
      <LinearGradient
        colors={[
          "rgba(236, 239, 242,1)",
          "rgba(236, 239, 242,0.95)",
          "rgba(236, 239, 242,0.8)",
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
        <MapView
          showsUserLocation
          showsMyLocationButton
          //   provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          style={{ flex: 1 }}
          onPress={() => {}}
        >
          <MapViewDirections
            origin={restaurantCoordinates}
            destination={userCoordinates}
            apikey="AIzaSyCtJg3Lgxb8McZf1Ju84Wj5rO-E1d0jwC0"
          />
        </MapView>
        <LinearGradient
          colors={[
            "rgba(236, 239, 242,0.4)",
            "rgba(236, 239, 242,0.95)",
            "rgba(236, 239, 242,1)",
          ]}
          style={{
            width: screenWidth,
            position: "absolute",
            bottom: 0,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              margin: PADDING_HORIZONTAL,
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
      </View>
    </View>
  );
};

export default ActiveOrderDetailScreen;

const styles = StyleSheet.create({});

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
