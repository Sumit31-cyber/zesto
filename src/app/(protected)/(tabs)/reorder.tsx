import { StyleSheet, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import CustomHeader from "components/CustomHeader";

import { COLORS, PADDING_HORIZONTAL } from "utils/constants";
import Animated, {
  useAnimatedScrollHandler,
  withTiming,
} from "react-native-reanimated";
import { useSharedState } from "context/sharedContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getOrderHistory } from "utils/ApiManager";
import FullScreenLoadingIndicator from "components/FullScreenLoadingIndicator";
import OrderHistoryCard from "components/OrderHistoryItem";

export interface OrderHistoryResponse {
  success: boolean;
  message: string;
  data: OrderHistoryData;
}

export interface OrderHistoryData {
  orders: OrderHistory[];
  totalOrders: number;
}

export interface OrderHistory {
  id: string;
  userId: string;
  restaurantId: string;
  status: string;
  total: string;
  addressId: string;
  createdAt: string;
  restaurant: OrderHistoryRestaurant;
  address: OrderHistoryAddress;
  items: OrderHistoryItemTypes[];
}

export interface OrderHistoryRestaurant {
  id: string;
  name: string;
  logoUrl: string;
  phone: string;
}

export interface OrderHistoryAddress {
  id: string;
  city: string;
  state: string;
}

export interface OrderHistoryItemTypes {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  itemPrice: string;
  totalItemPrice: string;
  createdAt: string;
  updatedAt: string;
  menuItem: OrderHistoryMenuItem;
  selectedAddons: OrderHistorySelectedAddon[];
}

export interface OrderHistoryMenuItem {
  id: string;
  name: string;
  imageUrl: string;
}

export interface OrderHistorySelectedAddon {
  id: string;
  orderItemId: string;
  addonId: string;
  quantity: number;
  addonPrice: string; // Consider using number
  addon: OrderHistoryAddons;
}

export interface OrderHistoryAddons {
  id: string;
  name: string;
}

const Reorder = () => {
  const { orders } = useSelector((state: RootState) => state.orderHistory);
  const { userId } = useAuth();

  const { data, isLoading, error, isError, isRefetching, refetch } =
    useQuery<OrderHistoryResponse>({
      queryKey: ["orders"],
      queryFn: () =>
        userId
          ? getOrderHistory(userId)
          : Promise.reject(new Error("No user ID")),
      enabled: !!userId, // Only run query if userId exists
    });

  console.log(JSON.stringify(data?.data, null, 2));

  const { scrollYGlobal, scrollY } = useSharedState();
  const { bottom } = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // "worklet";
      const currentScrollY = event.contentOffset.y;
      const isScrollingDown = currentScrollY > scrollYGlobal.value;

      scrollY.value = isScrollingDown ? withTiming(0) : withTiming(1);
      scrollYGlobal.value = currentScrollY;
    },
  });

  if (isLoading) {
    return <FullScreenLoadingIndicator />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.grayBackgroundColor }}>
      <CustomHeader title="Order History" />
      <Animated.FlatList
        // bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        data={data?.data.orders}
        onRefresh={refetch}
        refreshing={isRefetching}
        contentContainerStyle={{
          padding: PADDING_HORIZONTAL,
          gap: PADDING_HORIZONTAL,
          paddingBottom: bottom + 200,
        }}
        renderItem={({ item, index }) => {
          return (
            <OrderHistoryCard
              order={item}
              onPress={(order) => console.log(order)}
            />
          );
        }}
      />
    </View>
  );
};

export default Reorder;

const styles = StyleSheet.create({});
