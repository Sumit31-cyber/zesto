import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/store";
import dayjs from "dayjs";
import { OrderHistoryState, OrderHistoryType, OrderStatus } from "types/types";

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

      const newOrder: OrderHistoryType = {
        totalAmountPaid,
        deliveryCharge,
        foodItems,
        totalItemAmount,
        otherCharges,
        restaurant,
        deliveryTip,
        createdAt: formattedDate,
        status: OrderStatus.pending,
      };
      state.orders = [newOrder, ...state.orders];
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
