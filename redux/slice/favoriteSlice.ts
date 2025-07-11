import { createSlice } from "@reduxjs/toolkit";
import { FavoriteState } from "types/types";
import { RootState } from "redux/store";

const initialState: FavoriteState = {
  favorites: [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addItemToFavorite: (state, action) => {
      const { restaurant } = action.payload;
      state.favorites.push(restaurant);
    },
    removeItemFromFavorite: (state, action) => {
      const { restaurant } = action.payload;

      const existingRestaurantIndex = state.favorites.findIndex(
        (item) => item.id == restaurant.id
      );

      if (existingRestaurantIndex != null || undefined) {
        state.favorites.splice(existingRestaurantIndex, 1);
      }
    },
  },
});

export const { addItemToFavorite, removeItemFromFavorite } =
  favoriteSlice.actions;

// Export the reducer
export default favoriteSlice.reducer;

export const selectFavorite = (state: RootState) => state.cart;
