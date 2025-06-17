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
};
