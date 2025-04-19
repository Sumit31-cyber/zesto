import { CartItem, CartState, CustomizationOption, RestaurantDetails } from "utils/dataObject";

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecommendedRestaurantDataTypes } from "types/types";
import { RootState } from "redux/store";
import * as Crypto from "expo-crypto";
import { Alert } from "react-native";

const initialState: CartState = {
  carts: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // addItemToCart: (
    //   state,
    //   action: PayloadAction<{
    //     restaurant: RestaurantDetails;
    //     item: CartItem;
    //   }>
    // ) => {
    //   const { restaurant, item } = action.payload;
    //   console.log(JSON.stringify(item, null, 2))
    //   const existingRestaurantCart = state.carts.find(
    //     cart => cart.restaurant.id === restaurant.id
    //   );



    //   if(existingRestaurantCart){
    //     const existingCartItem = existingRestaurantCart.items.find((options) => options.id === item.id )

    //     if(existingCartItem){
    //       const existingCustomizationItem = existingRestaurantCart.items.find(cartItem => 
    //         cartItem.id === item.id && 
    //         JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
    //       );

    //       if(existingCustomizationItem){ 
    //         existingCartItem.quantity += item?.quantity;
    //         existingCartItem.cartPrice = (existingCartItem.cartPrice || 0) + item.price

    //         console.log(existingCartItem)
    //       } else{
    //         console.log('Adding new Customizations')
    //       }
    //     }else{
    //       existingRestaurantCart.items.push({...item})
    //     }
    //   }else{
    //     state.carts.push({
    //       restaurant,
    //       items:[{...item}]
    //     })
    //   }

    // },
addItemToCart: (state, action: PayloadAction<{
  restaurant: RecommendedRestaurantDataTypes;
  item: CartItem;
}>) => {
  const { restaurant, item } = action.payload;
  const existingRestaurant = state.carts.find(cart => cart.restaurant.id === restaurant.id);

  if (existingRestaurant) {
    const existingItemIndex = existingRestaurant.items.findIndex(cartItem => 
      cartItem.id === item.id && 
      JSON.stringify(cartItem.customizations || []) === JSON.stringify(item.customizations || [])
    );

    if (existingItemIndex >= 0) {
      const existingItem = existingRestaurant.items[existingItemIndex];
      existingItem.quantity += item.quantity;
      existingItem.cartPrice = existingItem.cartPrice ? existingItem.cartPrice + item.price  : item.price;
    } else {
      existingRestaurant.items.push({
        ...item,
        quantity: item.quantity,
        cartPrice: item.price,
        customizations: item.customizations || []
      });
    }
  } else {
    state.carts.push({
      restaurant,
      items: [{
        ...item,
        quantity: item.quantity,
        cartPrice: item.price,
        customizations: item.customizations || []
      }]
    });
  }
},

removeItemFromCart: (state, action: PayloadAction<{
  restaurant: RecommendedRestaurantDataTypes;
  item: CartItem;
}>) => {
  const { restaurant, item } = action.payload;
  const existingRestaurant = state.carts.find(cart => cart.restaurant.id === restaurant.id);

  if (!existingRestaurant) return;

  const itemIndex = existingRestaurant.items.findIndex(cartItem => 
    cartItem.id === item.id && 
    JSON.stringify(cartItem.customizations || []) === JSON.stringify(item.customizations || [])
  );

  if (itemIndex === -1) return;

  const existingItem = existingRestaurant.items[itemIndex];
  
  if (existingItem.quantity > 1) {
    existingItem.quantity -= 1;
    existingItem.cartPrice = existingItem.cartPrice ? existingItem.cartPrice - item.price : 0;
  } else {
    existingRestaurant.items.splice(itemIndex, 1);
    
    if (existingRestaurant.items.length === 0) {
      state.carts = state.carts.filter(cart => cart.restaurant.id !== restaurant.id);
    }
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

