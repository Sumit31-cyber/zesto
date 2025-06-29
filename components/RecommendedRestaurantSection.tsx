import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { COLORS, PADDING_HORIZONTAL, screenHeight } from "utils/constants";
import CustomText from "./customText";

import {
  RecommendedRestaurantDataTypes,
  Restaurant,
  RestaurantsResponse,
} from "types/types";
import { Image } from "expo-image";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { router } from "expo-router";
import RecommendedRestaurantListItem from "./RecommendedRestaurantListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getRestaurants } from "utils/ApiManager";

const RecommendedRestaurantSection = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: ["restaurants"],
      staleTime: Infinity,
      queryFn: ({ pageParam = 1 }) => getRestaurants(pageParam, 10),
      getNextPageParam: (lastPage, pages) => {
        // Check if there's a next page based on the pagination structure
        if (lastPage?.pagination?.hasNext) {
          return lastPage.pagination.page + 1;
        }
        return undefined; // No more pages
      },
      initialPageParam: 1, // Required for newer versions of TanStack Query
    });

  const flatData = data?.pages?.flatMap((page) => page.data) || [];

  console.log(JSON.stringify(flatData, null, 2));

  if (isLoading) {
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginVertical: screenHeight * 0.1,
          gap: 10,
        }}
      >
        <ActivityIndicator size={"large"} />
        <CustomText variant="h6" color={COLORS.gray}>
          Getting restaurants...
        </CustomText>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: PADDING_HORIZONTAL, paddingBottom: 400 }}>
      <CustomText
        variant="h6"
        fontFamily="gilroySemiBold"
        style={{ marginVertical: 10 }}
      >
        Top {flatData.length} restaurants to explore
      </CustomText>

      <FlatList
        keyExtractor={(_, index) => `${index}-restaurant`}
        data={flatData}
        style={{ marginTop: RFValue(10), gap: RFValue(18) }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <RecommendedRestaurantListItem
              key={index}
              item={item}
              index={index}
              onPress={() => {
                router.navigate({
                  pathname: "/(protected)/restaurant",
                  params: { restaurantId: item.id },
                });
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default RecommendedRestaurantSection;

const styles = StyleSheet.create({});
