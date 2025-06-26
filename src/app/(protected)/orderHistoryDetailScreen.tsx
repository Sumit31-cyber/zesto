import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { COLORS, PADDING_HORIZONTAL } from "utils/constants";
import HeaderSection from "components/HeaderSection";
import CustomHeader from "components/CustomHeader";
import { router, useLocalSearchParams } from "expo-router";
import { OrderData, OrderHistory, OrderHistoryData } from "types/types";
import { useAuth } from "@clerk/clerk-expo";
import { MapPin } from "lucide-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Image } from "expo-image";
import CustomText from "components/customText";
import DashedLine from "components/DashedLine";

const OrderHistoryDetailScreen = () => {
  const { order } = useLocalSearchParams<{ order: string }>();
  const { userId } = useAuth();

  const orderData: OrderHistory = JSON.parse(order);

  console.log(orderData);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const calculateItemTotal = () => {
    return orderData.items.reduce((total, item) => {
      return total + parseFloat(item.totalItemPrice);
    }, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "cancelled":
        return "#F44336";
      default:
        return "#666";
    }
  };
  console.log(userId);
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.grayBackgroundColor }}>
      <CustomHeader title={`Order #${orderData.id.substring(0, 13)}`} />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: PADDING_HORIZONTAL }}
      >
        <View style={{ backgroundColor: "white", borderRadius: RFValue(10) }}>
          {/* Restaurant Info */}
          <View style={styles.restaurantSection}>
            <View style={styles.locationPin}>
              <View>
                <MapPin size={RFValue(13)} color={COLORS.primary} />
              </View>
              <View
                style={{
                  flex: 1,
                  width: StyleSheet.hairlineWidth * 2,
                  backgroundColor: COLORS.primary,
                }}
              />
            </View>
            <View style={styles.restaurantInfo}>
              <CustomText
                variant="h6"
                fontFamily="gilroySemiBold"
                style={styles.restaurantName}
              >
                {orderData.restaurant.name}
              </CustomText>
              <CustomText
                variant="h7"
                color={COLORS.extraDarkGray}
                style={styles.restaurantAddress}
              >
                {orderData.restaurant.address.addressLine1}
              </CustomText>
              <CustomText
                variant="h7"
                color={COLORS.extraDarkGray}
                style={styles.restaurantAddress}
              >
                {orderData.address.city}, {orderData.address.state}
              </CustomText>
            </View>
          </View>

          {/* Delivery Address */}
          <View style={styles.addressSection}>
            <View style={styles.locationPin}>
              <View>
                <MapPin size={RFValue(13)} color={COLORS.primary} />
              </View>
            </View>
            <View style={styles.addressInfo}>
              <CustomText
                variant="h6"
                fontFamily="gilroySemiBold"
                style={styles.addressLabel}
              >
                Other
              </CustomText>
              <CustomText
                variant="h7"
                color={COLORS.extraDarkGray}
                style={styles.addressText}
              >
                {orderData.address.addressLine1}
              </CustomText>
              <CustomText
                variant="h7"
                color={COLORS.extraDarkGray}
                style={styles.addressText}
              >
                {orderData.address.city}, {orderData.address.state}
              </CustomText>
            </View>
          </View>
        </View>

        {/* Order Status */}
        <View style={styles.statusSection}>
          <View style={styles.statusIndicator}>
            <View
              style={[
                styles.checkmark,
                { backgroundColor: getStatusColor(orderData.status) },
              ]}
            >
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          </View>
          <View style={styles.statusInfo}>
            <CustomText
              variant="h7"
              fontFamily="gilroyMedium"
              color={COLORS.extraDarkGray}
              style={styles.statusText}
            >
              Order{" "}
              {orderData.status === "ready_for_pickup"
                ? "ready for pickup"
                : orderData.status}{" "}
              on {formatDate(orderData.createdAt)}
            </CustomText>
          </View>
        </View>

        {/* Bill Details */}
        <View style={styles.billSection}>
          <CustomText
            variant="h7"
            fontFamily="gilroyMedium"
            style={styles.billTitle}
          >
            BILL DETAILS
          </CustomText>

          {/* Items */}
          {orderData.items.map((item, index) => (
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
                ₹{orderData.total}
              </CustomText>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderHistoryDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  restaurantSection: {
    flexDirection: "row",
    marginTop: 8,
    padding: PADDING_HORIZONTAL,
    paddingBottom: 0,
  },
  locationPin: {
    alignItems: "center",
    marginRight: 12,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginBottom: 4,
  },
  pinLine: {
    width: 2,
    height: 30,
    backgroundColor: "#ddd",
  },
  restaurantInfo: {
    flex: 1,
    marginBottom: RFValue(10),
  },
  restaurantName: {
    color: COLORS.primary,
    marginBottom: 4,
  },
  restaurantAddress: {
    lineHeight: 20,
  },
  addressSection: {
    flexDirection: "row",
    padding: PADDING_HORIZONTAL,
    paddingTop: 0,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusSection: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    marginTop: 8,
    alignItems: "center",
    borderRadius: RFValue(10),
  },
  statusIndicator: {
    marginRight: 12,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  statusInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: {
    flex: 1,
  },
  statusBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    color: "#1976D2",
    fontWeight: "600",
  },
  billSection: {
    backgroundColor: "white",
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
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
