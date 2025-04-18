import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/store";
import CustomText from "components/customText";
import { clearAllCart } from "redux/slice/cartSlice";

const Favorite = () => {
  const { carts } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  return (
    <View
      onTouchStart={() => {
        // console.log(JSON.stringify(carts, null, 2));
      }}
      style={{ flex: 1, justifyContent: "center" }}
    >
      <TouchableOpacity
        onPress={() => {
          console.log(JSON.stringify(carts, null, 2));
        }}
      >
        <CustomText variant="h1" color="green">
          Console
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          dispatch(clearAllCart());
          // console.log(JSON.stringify(carts, null, 2));
        }}
      >
        <CustomText variant="h1" color="red">
          Clear Cart
        </CustomText>
      </TouchableOpacity>
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
                  <View style={{ flexDirection: "row" }}>
                    {item.customizations?.map((cus) => {
                      return <CustomText variant="h4">{cus.name} </CustomText>;
                    })}
                  </View>
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
