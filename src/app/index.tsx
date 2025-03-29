import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { router } from "expo-router";

const MainScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          router.navigate("/(auth)/signIn");
        }}
      >
        Go to auth screen
      </Text>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
