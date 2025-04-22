import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { reduxPersistStorage } from "utils/MMKVStorage";
import cartReducer from 'redux/slice/cartSlice'
import FavoriteReducer from 'redux/slice/favoriteSlice'

// Combine reducers
const rootReducer = combineReducers({
    cart:cartReducer,
    favorite:FavoriteReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "root",
  storage: reduxPersistStorage,
  whitelist: ['cart', 'favorite'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});


const persistor = persistStore(store);

export { store, persistor };