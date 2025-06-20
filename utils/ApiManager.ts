import axios from "axios";
import { ReactNativeFile } from "types/types";

const BASE_URL = "http://localhost:3000/api/v1/";
export const SOCKET_URL = "http://localhost:3000/";

export const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
});

const getRestaurants = async (page = 1, limit = 10) => {
  try {
    let formdata = new FormData();

    formdata.append("page", String(page));
    formdata.append("limit", String(limit));

    const res = await axiosInstance.post("/user/restaurants", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log(error);
  }
};
const getRestaurantDetail = async (restaurantId: string) => {
  try {
    let formdata = new FormData();

    console.log("Calling");

    formdata.append("restaurantId", String(restaurantId));

    const res = await axiosInstance.post(
      "/shared/restaurant/details",
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(res.data);

    return res.data.restaurant;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log(error);
  }
};

const addAddress = async (
  userId: string,
  addressLine1: string,
  addressLine2: string,
  state: string,
  city: string,
  postalCode: string,
  country: string,
  latitude: number | null,
  longitude: number | null,
  addressId?: string | null
) => {
  try {
    let formdata = new FormData();
    if (addressId) {
      formdata.append("id", addressId);
    }
    formdata.append("userId", userId);
    formdata.append("addressLine1", addressLine1);
    formdata.append("addressLine2", addressLine2);
    formdata.append("city", city);
    formdata.append("state", state);
    formdata.append("postalCode", postalCode);
    formdata.append("country", country);
    formdata.append("latitude", String(latitude));
    formdata.append("longitude", String(longitude));
    const res = await axiosInstance.post("/user/address", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log(error);
  }
};

const getUserInformation = async (id: string) => {
  console.log("Getting user");
  try {
    let formdata = new FormData();

    formdata.append("id", id);
    const res = await axiosInstance.post("/user/userInformation", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(res.data);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log(error);
  }
};

const createUser = async (
  id: string,
  firstName: string,
  lastName: string,
  emailAddress: string,
  phoneNumber: string
) => {
  try {
    let formdata = new FormData();

    formdata.append("id", id);
    formdata.append("email", emailAddress);
    formdata.append("firstName", firstName);
    formdata.append("lastName", lastName);
    formdata.append("role", "customer");
    formdata.append("phone", phoneNumber);

    const res = await axiosInstance.post("/user", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log(error);
  }
};

const uploadImage = async (localUri: string, name: string, type: string) => {
  const formData = new FormData();
  const file: ReactNativeFile = {
    uri: localUri,
    name: name || `image_${Date.now()}`,
    type: type || "image/jpeg",
  };

  formData.append("images", file as unknown as Blob);
  const res = await axiosInstance.post("/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

const searchRestaurant = async () => {};
const addRestaurantToFavorite = async () => {};
const placeOrder = async () => {};
const cancelOrder = async () => {};
const getOrderHistory = async () => {};

export {
  getRestaurants,
  getRestaurantDetail,
  searchRestaurant,
  addRestaurantToFavorite,
  placeOrder,
  cancelOrder,
  getOrderHistory,
  addAddress,
  getUserInformation,
  createUser,
  uploadImage,
};
