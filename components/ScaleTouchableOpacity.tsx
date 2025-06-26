import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SCALE_IN = 0.95;
const SCALE_OUT = 1;

const ScaleTouchable = ({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}) => {
  const scale = useSharedValue(1);

  const rStyle = useAnimatedStyle(() => {
    const opacityValue = interpolate(
      scale.value,
      [SCALE_IN, SCALE_OUT],
      [0.85, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale: scale.value }],
      opacity: opacityValue,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(SCALE_IN, { stiffness: 450, damping: 10 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(
      SCALE_OUT,
      { stiffness: 450, damping: 10 },
      (finished) => {
        if (finished && onPress) {
          runOnJS(onPress)();
        }
      }
    );
  };

  return (
    <Animated.View style={[rStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ ...style }}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ScaleTouchable;

const styles = StyleSheet.create({});
