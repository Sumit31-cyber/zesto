import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState, Restaurant } from "types/types";
import { RootState } from "redux/store";

const initialState: CartState = {
  carts: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (
      state,
      action: PayloadAction<{
        restaurant: Restaurant;
        item: CartItem;
      }>
    ) => {
      const { restaurant, item } = action.payload;
      const existingRestaurant = state.carts.find(
        (cart) => cart.restaurant.id === restaurant.id
      );
      if (existingRestaurant) {
        const existingItemIndex = existingRestaurant.items.findIndex(
          (cartItem) =>
            cartItem.id === item.id &&
            JSON.stringify(cartItem.addons || []) ===
              JSON.stringify(item.addons || [])
        );

        if (existingItemIndex >= 0) {
          const existingItem = existingRestaurant.items[existingItemIndex];
          existingItem.quantity += item.quantity;
          existingItem.cartPrice = existingItem.cartPrice
            ? Number(existingItem.cartPrice) + Number(item.price)
            : item.price;
        } else {
          existingRestaurant.items.push({
            ...item,
            quantity: item.quantity,
            cartPrice: item.cartPrice,
            addons: item.addons || [],
          });
        }
      } else {
        state.carts.push({
          restaurant,
          items: [
            {
              ...item,
              quantity: item.quantity,
              cartPrice: item.cartPrice,
              addons: item.addons || [],
            },
          ],
        });
      }
    },
    removeItemFromCart: (
      state,
      action: PayloadAction<{
        restaurant: Restaurant;
        item: CartItem;
      }>
    ) => {
      const { restaurant, item } = action.payload;
      const existingRestaurant = state.carts.find(
        (cart) => cart.restaurant.id === restaurant.id
      );
      if (!existingRestaurant) return;
      const itemIndex = existingRestaurant.items.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          JSON.stringify(cartItem.addons || []) ===
            JSON.stringify(item.addons || [])
      );
      if (itemIndex === -1) return;
      const existingItem = existingRestaurant.items[itemIndex];
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        existingItem.cartPrice = existingItem.cartPrice
          ? existingItem.cartPrice - item.price
          : 0;
      } else {
        existingRestaurant.items.splice(itemIndex, 1);
        if (existingRestaurant.items.length === 0) {
          state.carts = state.carts.filter(
            (cart) => cart.restaurant.id !== restaurant.id
          );
        }
      }
    },
    clearAllCart: (state, action) => {
      state.carts = [];
    },
    removeAllItemFromRestaurant: (state, action) => {
      const { restaurantId } = action.payload;

      console.log(restaurantId);
      const existingRestaurant = state.carts.find(
        (cart) => cart.restaurant.id == restaurantId
      );

      console.log(existingRestaurant);

      if (existingRestaurant) {
        console.log("Filtering");
        const filteredItem = state.carts.filter(
          (cart) => cart.restaurant.id != restaurantId
        );

        state.carts = filteredItem;

        console.log(filteredItem);
      }
    },
    clearRestaurantCart: (state, action) => {},
  },
});

export const {
  addItemToCart,
  clearAllCart,
  removeItemFromCart,
  removeAllItemFromRestaurant,
} = cartSlice.actions;

// Export the reducer
export default cartSlice.reducer;

export const selectCart = (state: RootState) => state.cart;

export const selectRestaurantCart = (restaurantId: string) =>
  createSelector(
    (state: RootState) =>
      state.cart.carts.find(
        (options) => options.restaurant.id === restaurantId
      ),
    (restaurantCart) => (restaurantCart ? [...restaurantCart.items] : [])
  );

export const selectRestaurantCartItem = (
  restaurantId: string,
  itemId: string
) =>
  createSelector(
    (state: RootState) =>
      state.cart.carts.find((option) => option.restaurant.id === restaurantId)
        ?.items,
    (items) => items?.find((option) => option.id === itemId) || null
  );
