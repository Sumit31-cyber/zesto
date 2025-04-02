import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { COLORS } from "utils/constants";

const Main = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={"large"} color={"white"} />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href={"/(protected)"} />;
  }
  if (!isSignedIn) {
    return <Redirect href={"/signIn"} />;
  }

  return (
    <View>
      <Text>Main</Text>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({});
