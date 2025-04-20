import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { BOTTOM_TAB_HEIGHT, COLORS, screenHeight } from "utils/constants";
import CustomText from "./customText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

const viewHeight = screenHeight * 0.08;
const CartFloatingStack = () => {
  const { carts } = useSelector((state: RootState) => state.cart);
  const [open, setOpen] = useState(false);
  console.log(carts.length);
  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(open ? 1 : 0),
    };
  });

  const { bottom } = useSafeAreaInsets();
  return (
    <View
      style={{
        height: open ? (viewHeight + 20) * carts.length : viewHeight,
        width: "100%",
        position: "absolute",
        bottom: BOTTOM_TAB_HEIGHT,
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          rStyle,
          {
            position: "absolute",
            height: "100%",
            width: "100%",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: "hidden",
          },
        ]}
      >
        <BlurView
          intensity={30}
          style={StyleSheet.absoluteFill}
          // tint={"dark"}
        />
      </Animated.View>
      {carts.map((item, index) => {
        return (
          <RenderBars
            key={index}
            index={index}
            onPress={() => {
              console.log("pressed");
              setOpen(!open);
            }}
            open={open}
          />
        );
      })}
    </View>
  );
};

export default CartFloatingStack;

const styles = StyleSheet.create({});

const RenderBars = ({
  open,
  index,
  onPress,
}: {
  open: boolean;
  index: number;
  onPress: () => void;
}) => {
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: open
            ? withTiming(index * -viewHeight - index * 10)
            : withTiming(0),
        },
      ],
    };
  });

  return (
    <Animated.View
      onTouchStart={onPress}
      style={[
        rStyle,
        {
          height: viewHeight,
          width: "90%",
          backgroundColor: "#a7c957",
          position: "absolute",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          bottom: 20,
          alignSelf: "center",
        },
      ]}
    >
      <CustomText variant="h5">{index}</CustomText>
    </Animated.View>
  );
};
