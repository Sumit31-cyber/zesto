import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import {
  DineoutIcon,
  FavoriteIcon,
  FoodIcon,
  ReorderIcon,
} from "assets/svgs/svgs";
import LocationHeader from "components/LocationHeader";

const Food = () => {
  const { signOut } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <LocationHeader />
    </View>
  );
};

export default Food;

const styles = StyleSheet.create({});
