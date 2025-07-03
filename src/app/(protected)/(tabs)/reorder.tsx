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
import { router } from "expo-router";
import { OrderHistoryResponse } from "types/types";

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

  // console.log(orders);

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

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.grayBackgroundColor }}>
      <CustomHeader title="Order History" />

      {isLoading ? (
        <FullScreenLoadingIndicator />
      ) : (
        <Animated.FlatList
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          data={orders}
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
                onPress={() => {
                  if (
                    item.status == "delivered" ||
                    item.status == "cancelled"
                  ) {
                    router.navigate({
                      pathname: "/(protected)/orderHistoryDetailScreen",
                      params: {
                        order: JSON.stringify(item),
                      },
                    });
                  } else {
                    router.navigate({
                      pathname: "/(protected)/activeOrderDetailScreen",
                      params: {
                        orderId: item.id,
                      },
                    });
                  }
                }}
              />
            );
          }}
        />
      )}
    </View>
  );
};

export default Reorder;

const styles = StyleSheet.create({});
