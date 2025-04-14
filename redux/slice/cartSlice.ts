import { CartItem, CartState, CustomizationOption, RestaurantDetails } from "utils/dataObject";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecommendedRestaurantDataTypes } from "types/types";

const initialState: CartState = {
  carts: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action : PayloadAction<{
      restaurant:RecommendedRestaurantDataTypes,
      item:CartItem
    }>) => {
      const {restaurant, item} = action.payload
      const restaurantExists = state.carts.find(options => options.restaurant.id === restaurant.id)

      if(restaurantExists){
        console.log('Item Exists in cart')
        //Check if item exists
        const existingFoodItem = restaurantExists?.items.find(cartItem => cartItem.id === item.id)

        if(existingFoodItem){

          existingFoodItem.quantity += item.quantity
          existingFoodItem.cartPrice =  (existingFoodItem.cartPrice || 0) + item.price

        }else{
        restaurantExists.items.push({
          ...item, quantity:1, price:item.price
        })
        }

      }else{
        console.log('Item Does not exists')
        state.carts.push({
          restaurant,
          items:[{...item, quantity:1, cartPrice:item.price, }]
        })
      }
    },
    removeItemFromCart: (state, action) => {},
    clearAllCart: (state, action) => {},
    clearRestaurantCart: (state, action) => {},
  },
});

export const {addItemToCart} = cartSlice.actions;

// Export the reducer
export default cartSlice.reducer;
