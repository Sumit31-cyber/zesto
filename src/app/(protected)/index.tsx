import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";

const HomeScreen = () => {
  const { signOut } = useAuth();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{ fontSize: 40 }}
        onPress={async () => {
          await signOut();
        }}
      >
        SignOut
      </Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
