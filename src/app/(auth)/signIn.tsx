import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { router } from "expo-router";

const signIn = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          router.navigate("/(protected)/homeScreen");
        }}
      >
        This is signin screen
      </Text>
    </View>
  );
};

export default signIn;

const styles = StyleSheet.create({});
