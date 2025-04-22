import {  FavoriteState } from "utils/dataObject";

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecommendedRestaurantDataTypes } from "types/types";
import { RootState } from "redux/store";
import * as Crypto from "expo-crypto";
import { Alert } from "react-native";

const initialState: FavoriteState = {
    favorites: [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addItemToFavorite:(state, action) => {
        const {id} = action.payload
        const existingRestaurantId = state.favorites.find(item => item.id == id)

        if(!existingRestaurantId){
            state.favorites.push({id})
        } 
    },
    removeItemFromFavorite: (state, action) => {
        const {id} = action.payload
        const existingRestaurantIndex = state.favorites.findIndex(item => item.id == id)

        if(existingRestaurantIndex != null || undefined){
            state.favorites.splice(existingRestaurantIndex, 1)
        } 
    }
  },
});

export const {addItemToFavorite, removeItemFromFavorite} = favoriteSlice.actions;

// Export the reducer
export default favoriteSlice.reducer;


export const selectFavorite = (state : RootState) => state.cart