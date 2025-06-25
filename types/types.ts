import { OrderHistory } from "@/app/(protected)/(tabs)/reorder";
import React, { ReactElement } from "react";
import { SectionListData as RNSectionListData } from "react-native";

export interface OfferItem {
  id: number;
  title: string;
  description: string;
  image: any;
  gradient: [string, string, string]; // Explicit tuple type
}

interface SectionListItem {
  // You can define the type of your item data here if needed
  // For example, if your items have specific properties:
  // id: number;
  // name: string;
  [key: string]: any; // Generic fallback if items can have any properties
}

export interface SectionListDataProps
  extends RNSectionListData<SectionListItem> {
  id: number;
  title: string;
  data: SectionListItem[];
  renderItem: () => React.ReactElement | null; // Must return ReactElement or null
}

type ImageRequireSource = ReturnType<typeof require>;

export interface FoodTypesProps {
  id: number;
  name: string;
  image: ImageRequireSource;
}

export interface RecommendedRestaurantDataTypes {
  id: string;
  name: string;
  discount: string;
  discountAmount: string;
  time: string;
  distance: string;
  rating?: number;
  imageUrl: string;
  address: string;
}

// Base types
type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type UserRole = "restaurant_owner" | "customer" | "admin";

// Opening hours type
interface OpeningHour {
  day: DayOfWeek;
  open: string | null;
  close: string | null;
  isClosed: boolean;
}

// Address type
interface Address {
  id: string;
  userId: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
}

// User/Owner type
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Main Restaurant type
interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logoUrl: string;
  coverImageUrl: string;
  phone: string;
  email: string;
  addressId: string;
  deliveryFee: string;
  minOrderAmount: string;
  estimatedDeliveryTime: number;
  isActive: boolean;
  openingHours: OpeningHour[];
  createdAt: string;
  updatedAt: string;
  address: Address;
  // owner: User;
}

// Paginated response type for API responses
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

// API response type for restaurants
type RestaurantsResponse = PaginatedResponse<Restaurant>;

// Opening hours for each day of the week
interface OpeningHours {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  open: string | null;
  close: string | null;
  isClosed: boolean;
}

// Menu category structure
interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Add-ons for menu items (appears to be empty array in your data)

// Individual menu item

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

// Main restaurant interface
interface RestaurantDetail {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logoUrl: string;
  coverImageUrl: string;
  phone: string;
  email: string;
  addressId: string;
  deliveryFee: string;
  minOrderAmount: string;
  estimatedDeliveryTime: number;
  isActive: boolean;
  openingHours: OpeningHours[];
  createdAt: string;
  updatedAt: string;
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  address: Address;
}

// API response wrapper
interface RestaurantApiResponse {
  success: boolean;
  message: string;
  restaurant: Restaurant;
}

interface ItemAddon {
  id: string;
  menuItemId?: string;
  name: string;
  price: string;
  isAvailable: boolean;
  status?: "new" | "existing" | "updated";
  createdAt?: string;
  updatedAt?: string;
}

interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  addons?: ItemAddon[];
}

export interface CartItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  quantity: number;
  cartPrice?: number;
  isBestSeller?: boolean;
  addons?: ItemAddon[];
}

export interface RestaurantCart {
  restaurant: Restaurant;
  items: CartItem[];
}
export interface CartState {
  carts: RestaurantCart[];
}

export interface FavoriteItem {
  id: string;
}
export interface FavoriteState {
  favorites: Restaurant[];
}

export interface UserState {
  userInformation: User;
}

export enum OrderStatus {
  "pending",
  "confirmed",
  "preparing",
  "ready_for_pickup",
  "delivered",
  "declined",
}

export interface OrderHistoryType {
  restaurant: Restaurant;
  foodItems: CartItem[];
  totalItemAmount: number;
  deliveryCharge: number;
  deliveryTip: number;
  otherCharges: number;
  totalAmountPaid: number;
  createdAt: string;
  status: OrderStatus;
}

export interface OrderHistoryState {
  orders: OrderHistory[];
}

type ReactNativeFile = {
  uri: string;
  name: string;
  type: string;
};

interface ImageResponse {
  data: [
    {
      format: string;
      height: number;
      publicId: string;
      url: string;
      width: number;
    }
  ];
  success: boolean;
}

interface LocationCoordinateType {
  longitude: number | null;
  latitude: number | null;
}

interface OrderItem {
  menuItemId: string;
  quantity: number;
  addons?: string[];
}

interface OrderData {
  userId: string;
  restaurantId: string;
  addressId: string;
  deliveryTip: number;
  otherCharges: number;
  items: OrderItem[];
}

// Export all types
export type {
  DayOfWeek,
  UserRole,
  OpeningHour,
  Address,
  User,
  Restaurant,
  PaginationMeta,
  PaginatedResponse,
  RestaurantsResponse,
  OpeningHours,
  MenuCategory,
  RestaurantDetail,
  RestaurantApiResponse,
  MenuItem,
  ItemAddon,
  ReactNativeFile,
  ImageResponse,
  LocationCoordinateType,
  OrderItem,
  OrderData,
};
