import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
  BORDER_WIDTH,
  COLORS,
  PADDING_HORIZONTAL,
  screenHeight,
  screenWidth,
} from "utils/constants";
import { FontAwesome } from "@expo/vector-icons";
import { ArrowLeft, X } from "lucide-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { router } from "expo-router";
import { debounce } from "utils/functions";
import { searchRestaurant } from "utils/ApiManager";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import RecommendedRestaurantListItem from "components/RecommendedRestaurantListItem";
import { Image } from "expo-image";
import CustomText from "components/customText";

const RestaurantSearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["restaurant_search", debounceSearchTerm],
    queryFn: () => searchRestaurant(debounceSearchTerm),
    enabled: !!searchTerm, // Only run query if restaurantId exists
  });

  const onClosePress = () => {
    setSearchTerm("");
    setDebounceSearchTerm("");
    queryClient.removeQueries({
      queryKey: ["restaurant_search"],
      exact: false,
    });
  };

  //   const search = async (term: string) => {
  //     const searchResponse = await searchRestaurant(term);

  //     if (searchResponse.success)
  //       console.log(JSON.stringify(searchResponse.restaurants, null, 2));
  //   };

  const searchWithDebounce = useCallback(
    debounce(setDebounceSearchTerm, 300),
    []
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.grayBackgroundColor,
      }}
    >
      {/* Search Bar */}
      <View style={{ paddingHorizontal: PADDING_HORIZONTAL, flex: 1 }}>
        <View style={{}}>
          <View
            style={{
              height: screenHeight * 0.06,
              width: "100%",
              backgroundColor: "white",
              borderRadius: 14,
              alignItems: "center",
              paddingHorizontal: 14,
              borderWidth: BORDER_WIDTH,
              borderColor: COLORS.grayBackgroundColor,
              marginVertical: 10,
            }}
          >
            <Pressable
              onPress={() => {
                router.back();
              }}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <ArrowLeft size={RFValue(16)} />
              <View style={{ flex: 1, justifyContent: "center" }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Search for restaurants..."
                  value={searchTerm}
                  onChangeText={(value) => setSearchTerm(value)}
                  onChange={(e) => {
                    if (e.nativeEvent.text.trim().length > 0)
                      searchWithDebounce(e.nativeEvent.text);
                    else onClosePress();
                  }}
                  autoFocus
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    overflow: "hidden",
                    height: RFValue(20),
                    aspectRatio: 1,
                  }}
                >
                  {searchTerm.length > 0 && (
                    <Animated.View
                      entering={SlideInRight.springify().damping(100)}
                      exiting={SlideOutRight.springify().damping(100)}
                    >
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          padding: RFValue(3),
                        }}
                        onPress={onClosePress}
                      >
                        <X color={COLORS.darkGray} size={RFValue(16)} />
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>
                <View
                  style={{
                    height: RFValue(20),
                    width: BORDER_WIDTH * 2,
                    backgroundColor: COLORS.grayBackgroundColor,
                  }}
                />
                <FontAwesome
                  name="microphone"
                  size={RFValue(14)}
                  color={COLORS.primary}
                  style={{ padding: RFValue(5) }}
                />
              </View>
            </Pressable>
          </View>
        </View>

        <View
          onTouchEnd={() => Keyboard.dismiss()}
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 10,
            padding: PADDING_HORIZONTAL,
          }}
        >
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size={"large"} color={COLORS.primary} />
            </View>
          ) : (
            <>
              {data?.restaurants.length === 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("assets/images/undraw_house.png")}
                    contentFit="contain"
                    style={{
                      width: screenWidth * 0.7,
                      height: screenHeight * 0.2,
                    }}
                  />
                  <CustomText
                    variant="h7"
                    fontFamily="gilroySemiBold"
                    color={COLORS.darkGray}
                    style={{ marginBottom: 2, marginTop: 10 }}
                  >
                    Uh-oh!
                  </CustomText>
                  <CustomText variant="h7" color={COLORS.darkGray}>
                    No results for {debounceSearchTerm}, Please try something
                    else
                  </CustomText>
                </View>
              ) : (
                <FlatList
                  data={data?.restaurants}
                  contentContainerStyle={{ gap: PADDING_HORIZONTAL }}
                  renderItem={({ item, index }) => (
                    <RecommendedRestaurantListItem
                      item={item}
                      index={index}
                      onPress={() => {
                        router.navigate({
                          pathname: "/(protected)/restaurant",
                          params: { restaurantId: item.id },
                        });
                      }}
                    />
                  )}
                />
              )}
            </>
          )}
          {/* {data?.restaurants && (
            <FlatList
              data={data?.restaurants}
              renderItem={({ item, index }) => (
                <RecommendedRestaurantListItem
                  item={item}
                  index={index}
                  onPress={() => {}}
                />
              )}
            />
          )} */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RestaurantSearchScreen;

const styles = StyleSheet.create({});
