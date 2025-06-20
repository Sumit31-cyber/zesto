import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "redux/store";

interface Address {
  id: string;
  userId: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean; // Fixed: changed from false to boolean
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string | null;
  role: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  userInformation: User | null;
}

const initialState: UserState = {
  userInformation: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.userInformation = action.payload;
    },

    addUserAddress: (state, action: PayloadAction<Address>) => {
      if (state.userInformation) {
        // If this is the first address or explicitly marked as default, make it default
        const isFirstAddress = state.userInformation.addresses.length === 0;
        const newAddress = {
          ...action.payload,
          isDefault: isFirstAddress || action.payload.isDefault,
        };

        // If new address is default, unset other default addresses
        if (newAddress.isDefault) {
          state.userInformation.addresses.forEach((addr) => {
            addr.isDefault = false;
          });
        }

        state.userInformation.addresses.push(newAddress);
        state.userInformation.updatedAt = new Date().toISOString();
      }
    },

    updateUserAddress: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Address> }>
    ) => {
      if (state.userInformation) {
        const { id, updates } = action.payload;
        const addressIndex = state.userInformation.addresses.findIndex(
          (addr) => addr.id === id
        );

        console.log("Address Index ", addressIndex);

        if (addressIndex !== -1) {
          const updatedAddress = {
            ...state.userInformation.addresses[addressIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          // If setting this address as default, unset others
          if (updates.isDefault) {
            state.userInformation.addresses.forEach((addr) => {
              addr.isDefault = false;
            });
          }
          console.log(
            "UPDATEDADD -> ",
            JSON.stringify(updatedAddress, null, 2)
          );
          state.userInformation.addresses[addressIndex] = updatedAddress;
          state.userInformation.updatedAt = new Date().toISOString();
        }
      }
    },

    removeUserAddress: (state, action: PayloadAction<string>) => {
      if (state.userInformation) {
        const addressId = action.payload;
        const addressIndex = state.userInformation.addresses.findIndex(
          (addr) => addr.id === addressId
        );

        if (addressIndex !== -1) {
          const wasDefault =
            state.userInformation.addresses[addressIndex].isDefault;
          state.userInformation.addresses.splice(addressIndex, 1);

          // If we removed the default address and there are other addresses, make the first one default
          if (wasDefault && state.userInformation.addresses.length > 0) {
            state.userInformation.addresses[0].isDefault = true;
          }

          state.userInformation.updatedAt = new Date().toISOString();
        }
      }
    },

    clearUser: (state) => {
      state.userInformation = null;
    },

    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.userInformation) {
        state.userInformation = {
          ...state.userInformation,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
  },
});

// Selectors
export const selectUser = (state: RootState) => state.user.userInformation;
export const selectUserAddresses = (state: RootState) =>
  state.user.userInformation?.addresses || [];
export const selectDefaultAddress = (state: RootState) =>
  state.user.userInformation?.addresses.find((addr) => addr.isDefault) || null;
export const selectIsUserLoggedIn = (state: RootState) =>
  state.user.userInformation !== null;

// Export actions
export const {
  setUser,
  addUserAddress,
  updateUserAddress,
  removeUserAddress,
  clearUser,
  updateUserProfile,
} = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
