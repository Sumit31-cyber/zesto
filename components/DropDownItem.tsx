import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS, PADDING_HORIZONTAL } from "utils/constants";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { RestaurantCart } from "utils/dataObject";
import { Image } from "expo-image";
import CustomText from "./customText";
import { AntDesign } from "@expo/vector-icons";
import {
  _dropDownItemHeight,
  _dropDownItemMargin,
  _marginBottom,
} from "./Dropdown";

export type ItemType = {
  id: number;
};
type Props = {
  item: RestaurantCart;
  index: number;
  dropdownItemLength: number;
  expanded: SharedValue<boolean>;
};

const DropDownItem: React.FC<Props> = ({
  item,
  index,
  dropdownItemLength,
  expanded,
}) => {
  const scale = 1 - index * 0.1;

  const expandedTransformY = -(
    index *
    (_dropDownItemHeight + _dropDownItemMargin)
  );

  const collapsedTransformY = -(index * 18);

  const expandedScaleValue = 1;
  const collapsedScaleValue = Math.max(0.8, Math.min(1, scale));

  const expandedOpacity = 1;
  const collapsedOpacity = index > 1 ? 0 : 1;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded.value ? expandedOpacity : collapsedOpacity),
      transform: [
        {
          translateY: withSpring(
            expanded.value ? expandedTransformY : collapsedTransformY,
            { damping: 12 }
          ),
        },
        {
          scale: withSpring(
            expanded.value ? expandedScaleValue : collapsedScaleValue
          ),
        },
      ],
      zIndex: dropdownItemLength - index,
    };
  });

  return (
    <Animated.View
      onTouchEnd={() => {
        expanded.value = !expanded.value;
      }}
      style={[
        animatedStyle,
        {
          position: "absolute",
          height: _dropDownItemHeight,
          width: "90%",
          justifyContent: "center",
          borderRadius: 12,
          bottom: _marginBottom,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          paddingHorizontal: PADDING_HORIZONTAL,
          flex: 1,
          borderRadius: 12,
        }}
      >
        <Image
          source={{ uri: item.restaurant.imageUrl }}
          style={{ height: "85%", aspectRatio: 1, borderRadius: 100 }}
        />
        <View
          style={{ flex: 1, paddingHorizontal: 10, marginRight: 10, gap: 2 }}
        >
          <CustomText variant="h7" fontFamily="aeonikBold" numberOfLines={1}>
            {item.restaurant.name}
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <CustomText variant="h7">View Menu</CustomText>
            <AntDesign
              name="caretright"
              size={8}
              color={"red"}
              style={{ marginTop: 3 }}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: COLORS.primary,
            paddingHorizontal: 20,
            paddingVertical: 6,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            gap: 2,
          }}
        >
          <CustomText variant="h7" fontFamily="aeonikBold" color="white">
            View Cart
          </CustomText>
          <CustomText variant="h7" color="white">
            {item.items.length} items
          </CustomText>
        </View>
      </View>
    </Animated.View>
  );
};

export default DropDownItem;

const styles = StyleSheet.create({});
