import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import CustomHeader from "components/CustomHeader";

import { BORDER_WIDTH, COLORS, PADDING_HORIZONTAL } from "utils/constants";
import CustomText from "components/customText";
import { AntDesign } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import DashedLine from "components/DashedLine";
import Animated, {
  useAnimatedScrollHandler,
  withTiming,
} from "react-native-reanimated";
import { useSharedState } from "context/sharedContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OrderHistoryType, OrderStatus } from "types/types";
import {
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  ChefHat,
  Clock,
  MapPin,
  Package,
  Timer,
  Truck,
  X,
  XCircle,
} from "lucide-react-native";

interface Props {
  item: OrderHistoryType;
  index: number;
}

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.pending:
      return {
        icon: Clock,
        backgroundColor: "#FF9500", // Orange
        color: "white",
      };
    case OrderStatus.accepted:
      return {
        icon: CheckCircle,
        backgroundColor: "#34C759", // Green
        color: "white",
      };
    case OrderStatus.preparing:
      return {
        icon: ChefHat,
        backgroundColor: "#007AFF", // Blue
        color: "white",
      };
    case OrderStatus.ready:
      return {
        icon: Package,
        backgroundColor: "#5856D6", // Purple
        color: "white",
      };
    case OrderStatus.picked_up:
      return {
        icon: Truck,
        backgroundColor: "#FF9500", // Orange
        color: "white",
      };
    case OrderStatus.in_transit:
      return {
        icon: MapPin,
        backgroundColor: "#007AFF", // Blue
        color: "white",
      };
    case OrderStatus.delivered:
      return {
        icon: CheckCircle2,
        backgroundColor: "#34C759", // Green
        color: "white",
      };
    case OrderStatus.declined:
      return {
        icon: XCircle,
        backgroundColor: "#FF3B30", // Red
        color: "white",
      };
    case OrderStatus.cancelled:
      return {
        icon: X,
        backgroundColor: "#8E8E93", // Gray
        color: "white",
      };
    case OrderStatus.failed:
      return {
        icon: AlertTriangle,
        backgroundColor: "#FF3B30", // Red
        color: "white",
      };
    default:
      return {
        icon: Clock,
        backgroundColor: "#FF9500",
        color: "white",
      };
  }
};

const RenderStatusIcon = ({ status }: { status: OrderStatus }) => {
  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <View
      style={{
        padding: RFValue(2),
        backgroundColor: config.backgroundColor,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconComponent color={config.color} size={RFValue(10)} strokeWidth={2} />
    </View>
  );
};
const OrderHistoryItem: React.FC<Props> = ({ item, index }) => {
  return (
    <View style={{ backgroundColor: "white", borderRadius: 14 }}>
      <View style={{ gap: 8, padding: PADDING_HORIZONTAL }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <CustomText variant="h5" fontFamily={"gilroyMedium"}>
            {item.restaurant.name}
          </CustomText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <CustomText
              variant="h7"
              fontFamily={"gilroyMedium"}
              color={COLORS.darkGray}
            >
              {item.status}
            </CustomText>
            <RenderStatusIcon status={item.status} />
          </View>
        </View>
        <CustomText
          variant="h7"
          fontFamily={"gilroyMedium"}
          color={COLORS.darkGray}
          numberOfLines={1}
        >
          {item.restaurant.address.addressLine1}
        </CustomText>
        <CustomText
          variant="h6"
          fontFamily={"gilroySemiBold"}
          color={COLORS.darkGray}
          numberOfLines={1}
          style={{ marginTop: 5 }}
        >
          Rs. {item.totalAmountPaid}
        </CustomText>
      </View>
      <DashedLine style={{}} />
      <View style={{ padding: PADDING_HORIZONTAL, gap: 10 }}>
        {item.foodItems.map((fItem, index) => {
          return (
            <CustomText
              key={index}
              variant="h7"
              color={"black"}
              style={{ opacity: 0.6 }}
              fontFamily="gilroyMedium"
              numberOfLines={1}
            >
              {fItem.name} ({fItem.quantity})
            </CustomText>
          );
        })}
        <CustomText
          key={index}
          variant="h7"
          color={COLORS.darkGray}
          fontFamily="gilroyMedium"
          numberOfLines={1}
          style={{ marginTop: 6 }}
        >
          {item.createdAt}
        </CustomText>

        <View style={{ flexDirection: "row", gap: 20, marginTop: RFValue(10) }}>
          <View
            style={{
              flex: 1,
              borderWidth: BORDER_WIDTH,
              borderColor: COLORS.black,
              paddingVertical: RFValue(8),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
            }}
          >
            <CustomText variant="h6" fontFamily="gilroySemiBold">
              REORDER
            </CustomText>
          </View>
          <View
            style={{
              flex: 1,
              borderWidth: BORDER_WIDTH,
              borderColor: COLORS.primary,
              paddingVertical: RFValue(8),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
            }}
          >
            <CustomText
              variant="h6"
              fontFamily="gilroySemiBold"
              color={COLORS.primary}
            >
              RATE FOOD
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderHistoryItem;
