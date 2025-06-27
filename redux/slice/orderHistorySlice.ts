import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "redux/store";
import dayjs from "dayjs";
import { OrderHistoryState } from "types/types";

const initialState: OrderHistoryState = {
  orders: [],
};

const orderHistorySlice = createSlice({
  name: "orderHistory",
  initialState,
  reducers: {
    setInitialOrders: (state, action) => {
      console.log(JSON.stringify(action.payload, null, 2));
      state.orders = action.payload;
    },
    addToOrderHistory: (state, action) => {
      const { order } = action.payload;
      state.orders = [order, ...state.orders];
    },

    changeOrderStatus: (state, action) => {
      const { orderId, newStatus } = action.payload;
      const existingOrder = state.orders.find((item) => item.id === orderId);
      if (existingOrder) {
        existingOrder.status = newStatus;
      }
    },

    clearOrderHistory: (state) => {
      state.orders = [];
    },
  },
});

export const {
  addToOrderHistory,
  changeOrderStatus,
  clearOrderHistory,
  setInitialOrders,
} = orderHistorySlice.actions;

// Export the reducer
export default orderHistorySlice.reducer;

export const selectOrderHistory = (state: RootState) => state.orderHistory;
export const selectOrder = (state: RootState, orderId: string) =>
  state.orderHistory.orders.find((item) => item.id === orderId);
