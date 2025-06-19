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
import { OrderHistoryType } from "types/types";

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
          return <OrderHistoryCart item={item} index={index} />;
        }}
      />
    </View>
  );
};

export default Reorder;

const styles = StyleSheet.create({});

interface Props {
  item: OrderHistoryType;
  index: number;
}
const OrderHistoryCart: React.FC<Props> = ({ item, index }) => {
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
              Delivered
            </CustomText>
            <View
              style={{
                padding: RFValue(2),
                backgroundColor: COLORS.primary,
                borderRadius: 100,
              }}
            >
              <AntDesign name="check" size={RFValue(10)} color={"white"} />
            </View>
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
