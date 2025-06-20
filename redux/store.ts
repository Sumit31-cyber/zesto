import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { reduxPersistStorage } from "utils/MMKVStorage";
import cartReducer from "redux/slice/cartSlice";
import FavoriteReducer from "redux/slice/favoriteSlice";
import OrderHistoryReducer from "redux/slice/orderHistorySlice";
import userReducer from "redux/slice/userSlice";

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  favorite: FavoriteReducer,
  orderHistory: OrderHistoryReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "root",
  storage: reduxPersistStorage,
  whitelist: ["cart", "favorite", "orderHistory", "user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/PURGE"],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };

export const clearAllPersistedData = async () => {
  try {
    await persistor.purge();
    console.log("All persisted data cleared successfully");
  } catch (error) {
    console.error("Error clearing persisted data:", error);
  }
};
