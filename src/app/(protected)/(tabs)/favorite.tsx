import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import CustomText from "components/customText";

const Favorite = () => {
  const { carts } = useSelector((state: RootState) => state.cart);
  return (
    <View
      onTouchStart={() => {
        console.log(JSON.stringify(carts, null, 2));
      }}
      style={{ flex: 1, justifyContent: "center" }}
    >
      {carts.map((item, index) => {
        return (
          <View style={{ marginBottom: 50 }}>
            <CustomText variant="h4">{item.restaurant.name}</CustomText>
            {item.items.map((item, index) => {
              return (
                <>
                  <Text>{item.name}</Text>
                  <Text>{item.quantity}</Text>
                  <Text>{item.cartPrice}</Text>
                </>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export default Favorite;

const styles = StyleSheet.create({});
