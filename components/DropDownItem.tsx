import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
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
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  _dropDownItemHeight,
  _dropDownItemMargin,
  _marginBottom,
} from "./Dropdown";
import { router } from "expo-router";
import { wait } from "utils/functions";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch } from "react-redux";
import { removeAllItemFromRestaurant } from "redux/slice/cartSlice";

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
  const dispatch = useDispatch();
  const foodQuantity = useMemo(() => {
    const quantity = item.items.reduce((acc, curr) => acc + curr.quantity, 0);

    return quantity;
  }, [item]);

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

  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded.value ? 0 : 1),
    };
  });

  return (
    <Animated.View
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
      {index == 1 && (
        <Animated.View
          onTouchEnd={() => {
            expanded.value = !expanded.value;
          }}
          style={[
            animatedOpacity,
            {
              position: "absolute",
              zIndex: 100,
              backgroundColor: COLORS.primary,
              top: -15,
              height: 30,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 100,
              paddingHorizontal: 10,
              paddingVertical: 5,
              gap: 5,
              alignSelf: "center",
            },
          ]}
        >
          <CustomText variant="h7" color="white" fontFamily="gilroyBold">
            All Carts
          </CustomText>
          <AntDesign
            name="caretup"
            size={12}
            color="white"
            style={{ marginTop: 2 }}
          />
        </Animated.View>
      )}
      <Pressable
        onPress={async () => {
          if (expanded.value) {
            expanded.value = !expanded.value;
            await wait(200); // To make the navigation smoother
          }
          router.navigate({
            pathname: "/(protected)/restaurant",
            params: { restaurantId: item.restaurant.id },
          });
        }}
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
          <CustomText variant="h7" fontFamily="gilroyBold" numberOfLines={1}>
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
        <TouchableOpacity
          onPress={() => {
            router.navigate({
              pathname: "/(protected)/cart",
              params: { cartItemData: JSON.stringify(item) },
            });
          }}
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
          <CustomText variant="h7" fontFamily="gilroyBold" color="white">
            View Cart
          </CustomText>
          <CustomText variant="h7" color="white">
            {foodQuantity} items
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            dispatch(
              removeAllItemFromRestaurant({ restaurantId: item.restaurant.id })
            );
          }}
          style={{
            backgroundColor: "#ff5f4d",
            paddingHorizontal: RFValue(3),
            paddingVertical: 6,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            marginLeft: 10,
          }}
        >
          <MaterialIcons name="delete" size={RFValue(14)} color="white" />
        </TouchableOpacity>
      </Pressable>
    </Animated.View>
  );
};

export default DropDownItem;

const styles = StyleSheet.create({});
