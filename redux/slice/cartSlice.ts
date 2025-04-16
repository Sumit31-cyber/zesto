import { CartItem, CartState, CustomizationOption, RestaurantDetails } from "utils/dataObject";

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecommendedRestaurantDataTypes } from "types/types";
import { RootState } from "redux/store";

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
        const existingFoodItem = restaurantExists?.items.find(cartItem => cartItem.id === item.id)

        if(existingFoodItem){

          existingFoodItem.quantity += item.quantity
          existingFoodItem.cartPrice =  (existingFoodItem.cartPrice || 0) + item.price

        }else{
        restaurantExists.items.push({
          ...item, quantity:item.quantity, price:item.price
        })
        }

      }else{
        console.log('Item Does not exists')
        state.carts.push({
          restaurant,
          items:[{...item, quantity:item.quantity, cartPrice:item.price, }]
        })
      }
    },
    removeItemFromCart: (state, action) => {
      const {restaurant, item} = action.payload
      const restaurantExists = state.carts.find(options => options.restaurant.id === restaurant.id)

      if(restaurantExists){
        console.log('Item Exists in cart')
        const existingFoodItem = restaurantExists?.items.find(cartItem => cartItem.id === item.id)

        if(existingFoodItem){
          if( existingFoodItem.quantity == 1){
            const filteredList = restaurantExists.items.filter((options) => (options.id != item.id))
         restaurantExists.items = filteredList
          }

          existingFoodItem.quantity -= 1
          existingFoodItem.cartPrice =  (existingFoodItem.cartPrice || 0) - item.price

        }else{
          const filteredList = restaurantExists.items.filter((options) => (options.id != item.id))
         restaurantExists.items = filteredList
        }

      }else{
        console.log('Item Does not exists')
        state.carts.push({
          restaurant,
          items:[{...item, quantity:item.quantity, cartPrice:item.price, }]
        })
      }
    },
    clearAllCart: (state, action) => {
      state.carts = []
    },
    clearRestaurantCart: (state, action) => {},
  },
});

export const {addItemToCart,clearAllCart, removeItemFromCart} = cartSlice.actions;

// Export the reducer
export default cartSlice.reducer;


export const selectCart = (state : RootState) => state.cart

export const selectRestaurantCart = (restaurantId : number) => createSelector(
  (state : RootState) => state.cart.carts.find(options => (options.restaurant.id === restaurantId)),
  restaurantCart =>  (restaurantCart ? [...restaurantCart.items] : [])
)

export const selectRestaurantCartItem = (restaurantId : number, itemId:string) => createSelector(
  (state : RootState) => 
    state.cart.carts.find(option => option.restaurant.id === restaurantId)?.items,
  items => items?.find(option => option.id === itemId) || null)