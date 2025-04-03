import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import {
  DineoutIcon,
  FavoriteIcon,
  FoodIcon,
  ReorderIcon,
} from "assets/svgs/svgs";

const Food = () => {
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
      <FoodIcon size={30} />
      <FavoriteIcon size={30} />
      <DineoutIcon size={30} />
      <ReorderIcon size={30} />
    </View>
  );
};

export default Food;

const styles = StyleSheet.create({});
