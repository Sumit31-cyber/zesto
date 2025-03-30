import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { COLORS } from "utils/constants";

const MainScreen = () => {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/(auth)/signIn");
    }, 500);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
      }}
    >
      <ActivityIndicator color={"white"} size={"large"} />
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
