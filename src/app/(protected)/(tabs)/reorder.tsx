import { StyleSheet, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import CustomHeader from "components/CustomHeader";

import { PADDING_HORIZONTAL } from "utils/constants";
import Animated, {
  useAnimatedScrollHandler,
  withTiming,
} from "react-native-reanimated";
import { useSharedState } from "context/sharedContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OrderHistoryItem from "components/OrderHistoryItem";

const Reorder = () => {
  const { orders } = useSelector((state: RootState) => state.orderHistory);

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
    <View style={{ flex: 1, backgroundColor: "#eceff2" }}>
      <CustomHeader title="Order History" />
      <Animated.FlatList
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        data={orders}
        contentContainerStyle={{
          padding: PADDING_HORIZONTAL,
          gap: PADDING_HORIZONTAL,
          paddingBottom: bottom + 200,
        }}
        renderItem={({ item, index }) => {
          return <OrderHistoryItem item={item} index={index} />;
        }}
      />
    </View>
  );
};

export default Reorder;

const styles = StyleSheet.create({});
