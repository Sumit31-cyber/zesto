import {
  Pressable,
  StyleSheet,
  Text,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC } from "react";
import {
  BORDER_WIDTH,
  COLORS,
  FONT_SIZE,
  FONTS,
  screenHeight,
} from "utils/constants";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import RollingContent from "react-native-rolling-bar";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { router } from "expo-router";

type PropsType = {
  onClosePress?: () => void;
  value: string;
} & TextInputProps;

const searchSuggestions = ["Biryani", "Sweets", "Pizza", "Cake"];
const SearchBar = ({ value, onClosePress, ...props }: PropsType) => {
  const showPlaceholder = value.length == 0;
  const showCloseButton = value.length > 0;

  return (
    <View style={{ paddingVertical: 10 }}>
      <View
        style={{
          height: screenHeight * 0.06,
          width: "100%",
          backgroundColor: "white",
          borderRadius: 14,
          alignItems: "center",
          paddingHorizontal: 14,
          borderWidth: BORDER_WIDTH,
          borderColor: COLORS.grayBackgroundColor,
          marginVertical: 10,
        }}
      >
        <Pressable
          onPress={() => {
            router.navigate("/restaurantSearchScreen");
          }}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <AntDesign name="search1" size={24} color={COLORS.darkGray} />
          <View style={{ flex: 1, justifyContent: "center" }}>
            {showPlaceholder && (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut.duration(100)}
                style={{
                  flex: 1,
                  height: screenHeight * 0.06,
                  width: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  position: "absolute",
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.Regular,
                    fontSize: FONT_SIZE.h2,
                    color: COLORS.darkGray,
                  }}
                >
                  Search for{" "}
                </Text>
                <RollingContent interval={3000} defaultStyle={false}>
                  {searchSuggestions.map((item, index) => {
                    return (
                      <Text
                        key={index}
                        style={{
                          fontFamily: FONTS.Regular,
                          fontSize: FONT_SIZE.h2,
                          color: COLORS.darkGray,
                        }}
                      >
                        '{item}'
                      </Text>
                    );
                  })}
                </RollingContent>
              </Animated.View>
            )}
          </View>

          {showCloseButton && (
            <TouchableOpacity style={{}} onPress={onClosePress}>
              <AntDesign name="close" size={24} color={COLORS.darkGray} />
            </TouchableOpacity>
          )}
          <View
            style={{
              height: "60%",
              width: BORDER_WIDTH,
              backgroundColor: COLORS.darkGray,
              marginHorizontal: 2,
            }}
          />
          <FontAwesome name="microphone" size={24} color={COLORS.primary} />
        </Pressable>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
