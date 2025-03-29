import { StyleSheet, Text, View } from "react-native";
import React from "react";

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>This screen is protected</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
