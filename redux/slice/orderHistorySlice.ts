import { CartItem, CartState, CustomizationOption, OrderHistoryState, RestaurantDetails } from "utils/dataObject";

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecommendedRestaurantDataTypes } from "types/types";
import { RootState } from "redux/store";
import * as Crypto from "expo-crypto";
import { Alert } from "react-native";
import dayjs from "dayjs";

const now = dayjs();
const initialState: OrderHistoryState = {
  orders: [],
};

const orderHistorySlice = createSlice({
  name: "orderHistory",
  initialState,
  reducers: {
    addToOrderHistory : (state, action) => {
        const {restaurant, foodItems, deliveryCharge, otherCharges, totalItemAmount, totalAmountPaid, deliveryTip} = action.payload
        const formattedDate = now.format('MMMM DD, h:mmA');
        state.orders.push({
            totalAmountPaid,
            deliveryCharge,
            foodItems,
            totalItemAmount,
            otherCharges,
            restaurant,
            deliveryTip,
            createdAt :formattedDate
        })
    },

    clearOrderHistory : (state) => {
      state.orders = []
    }
  },
});

export const {addToOrderHistory,clearOrderHistory} = orderHistorySlice.actions;

// Export the reducer
export default orderHistorySlice.reducer;


export const selectOrderHistory = (state : RootState) => state.cart
