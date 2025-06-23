import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  OrderHistory,
  OrderHistoryItemTypes,
} from "@/app/(protected)/(tabs)/reorder";
import { Image } from "expo-image";
import CustomText from "./customText";
import { COLORS } from "utils/constants";

const OrderHistoryCard = ({
  order,
  onPress,
}: {
  order: OrderHistory;
  onPress: (order: OrderHistory) => void;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FFA500";
      case "preparing":
        return "#2196F3";
      case "delivered":
        return "#4CAF50";
      case "cancelled":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusText = (status: string) => {
    return status === "ready_for_pickup" ? "Ready for pickup" : status;
  };

  const calculateTotalItems = () => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  const renderOrderItems = () => {
    return order.items.map((item, index) => (
      <View key={item.id} style={styles.orderItem}>
        <Image
          source={{ uri: item.menuItem.imageUrl }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <CustomText
            variant="h7"
            fontFamily="gilroyMedium"
            style={styles.itemName}
            numberOfLines={1}
          >
            {item.menuItem.name}
          </CustomText>
          <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
          {item.selectedAddons && item.selectedAddons.length > 0 && (
            <CustomText
              variant="h7"
              style={styles.addonsText}
              // numberOfLines={1}
            >
              +{" "}
              {item.selectedAddons.map((addon) => addon.addon.name).join(", ")}
            </CustomText>
          )}
        </View>
        <Text style={styles.itemPrice}>₹{item.totalItemPrice}</Text>
      </View>
    ));
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress && onPress(order)}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.restaurantInfo}>
          <Image
            source={{ uri: order.restaurant.logoUrl }}
            style={styles.restaurantLogo}
          />
          <View style={styles.restaurantDetails}>
            <CustomText
              variant="h6"
              fontFamily="gilroyBold"
              style={styles.restaurantName}
            >
              {order.restaurant.name}
            </CustomText>
            <CustomText variant="h7" style={styles.orderDate}>
              {formatDate(order.createdAt)}
            </CustomText>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) },
          ]}
        >
          <CustomText
            variant="h7"
            fontFamily="gilroyBold"
            style={styles.statusText}
          >
            {getStatusText(order.status).toUpperCase()}
          </CustomText>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.itemsContainer}>{renderOrderItems()}</View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.orderSummary}>
          <CustomText
            variant={"h7"}
            fontFamily="gilroyMedium"
            style={styles.totalItems}
          >
            {calculateTotalItems()} item{calculateTotalItems() > 1 ? "s" : ""}
          </CustomText>
          <CustomText variant="h7" style={styles.deliveryAddress}>
            {order.address.city}, {order.address.state}
          </CustomText>
        </View>
        <View style={styles.totalContainer}>
          <CustomText variant="h7" style={styles.totalLabel}>
            Total
          </CustomText>
          <CustomText
            variant="h6"
            fontFamily="gilroyBold"
            style={styles.totalAmount}
          >
            ₹{order.total}
          </CustomText>
        </View>
      </View>

      {/* Order Actions */}
      <View style={styles.actions}>
        <TouchableOpacity activeOpacity={0.8} style={styles.actionButton}>
          <CustomText
            variant="h7"
            fontFamily="gilroyMedium"
            style={styles.actionButtonText}
          >
            View Details
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.actionButton, styles.reorderButton]}
        >
          <CustomText variant="h7" fontFamily="gilroyMedium" color="white">
            Reorder
          </CustomText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default OrderHistoryCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  restaurantInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  restaurantLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    color: "#333",
  },
  orderDate: {
    color: "#666",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    top: 1.5,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: "#333",
  },
  itemQuantity: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  addonsText: {
    color: "#888",
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 16,
  },
  orderSummary: {
    flex: 1,
  },
  totalItems: {
    color: "#333",
    fontWeight: "500",
  },
  deliveryAddress: {
    color: "#666",
    marginTop: 2,
  },
  totalContainer: {
    alignItems: "flex-end",
  },
  totalLabel: {
    color: "#666",
  },
  totalAmount: {
    fontWeight: "bold",
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 4,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#666",
  },
  reorderButton: {
    backgroundColor: COLORS.primary,
  },
  reorderButtonText: {
    color: "#fff",
  },
});
