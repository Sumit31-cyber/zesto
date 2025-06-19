import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/store";
import dayjs from "dayjs";
import { OrderHistoryState } from "types/types";

const now = dayjs();
const initialState: OrderHistoryState = {
  orders: [],
};

const orderHistorySlice = createSlice({
  name: "orderHistory",
  initialState,
  reducers: {
    addToOrderHistory: (state, action) => {
      const {
        restaurant,
        foodItems,
        deliveryCharge,
        otherCharges,
        totalItemAmount,
        totalAmountPaid,
        deliveryTip,
      } = action.payload;
      const formattedDate = now.format("MMMM DD, h:mmA");
      state.orders.push({
        totalAmountPaid,
        deliveryCharge,
        foodItems,
        totalItemAmount,
        otherCharges,
        restaurant,
        deliveryTip,
        createdAt: formattedDate,
      });
    },

    clearOrderHistory: (state) => {
      state.orders = [];
    },
  },
});

export const { addToOrderHistory, clearOrderHistory } =
  orderHistorySlice.actions;

// Export the reducer
export default orderHistorySlice.reducer;

export const selectOrderHistory = (state: RootState) => state.cart;
