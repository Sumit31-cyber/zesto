import React, { useMemo } from "react";
import {
  BottomSheetBackdropProps,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface Props {
  animatedIndex: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
  handleBackdropPress?: () => void;
}
const ModalBackdrop = ({
  animatedIndex,
  style,
  handleBackdropPress = () => {},
}: Props) => {
  // animated variables
  const { dismiss } = useBottomSheetModal();
  const onBackdropPress = () => {
    dismiss();
    handleBackdropPress();
  };
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 0.5],
      Extrapolate.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: "#111",
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View style={containerStyle}>
      <Pressable onPress={onBackdropPress} style={{ flex: 1 }} />
    </Animated.View>
  );
};

export default ModalBackdrop;
