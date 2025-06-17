import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useRef } from "react";
import {
  RecommendedRestaurantDataTypes,
  Restaurant,
  RestaurantsResponse,
} from "types/types";
import { RFValue } from "react-native-responsive-fontsize";
import { Image } from "expo-image";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, PADDING_HORIZONTAL } from "utils/constants";
import CustomText from "./customText";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import {
  addItemToFavorite,
  removeItemFromFavorite,
  selectFavorite,
} from "redux/slice/favoriteSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/store";

type Props = {
  item: Restaurant;
  index: number;
  onPress: () => void;
};
const RecommendedRestaurantListItem: React.FC<Props> = ({
  item,
  index,
  onPress,
}) => {
  const { favorites } = useSelector((state: RootState) => state.favorite);
  const dispatch = useDispatch();
  const likeAnimationRef = useRef<LottieView>(null);
  const isFavorite = useMemo(() => {
    return favorites.some((option) => option.id === item.id);
  }, [favorites, item.id]); // Only depend on item.id instead of the whole item

  useEffect(() => {
    // console.log(favorites);
    if (!likeAnimationRef.current) return;

    if (isFavorite) {
      likeAnimationRef.current.play(0, 20);
    } else {
      likeAnimationRef.current.play(11, 0);
    }
  }, [isFavorite]); // Remove item from dependencies if not needed
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: "row", gap: RFValue(10) }}
    >
      <View
        style={{
          width: RFValue(100),
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 2,
          borderRadius: 30,
        }}
      >
        <Image
          contentFit="cover"
          source={{ uri: item.logoUrl }}
          style={{
            height: RFValue(120),
            width: "100%",
            borderRadius: 20,
          }}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: 20, overflow: "hidden" },
          ]}
        >
          <LinearGradient
            start={{ x: 0.5, y: -0.2 }}
            colors={["transparent", "rgba(0,0,0,0.9)"]}
            style={{
              flex: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (isFavorite) {
                  dispatch(removeItemFromFavorite({ restaurant: item }));
                  return;
                }
                dispatch(addItemToFavorite({ restaurant: item }));
              }}
              style={{
                zIndex: 100,
                width: RFValue(40),
                height: RFValue(40),
                top: -RFValue(15),
                right: -RFValue(60),
                borderRadius: 100,
              }}
            >
              <LottieView
                ref={likeAnimationRef}
                autoPlay
                loop={false}
                resizeMode="contain"
                speed={0.8}
                style={{
                  width: RFValue(50),
                  height: RFValue(50),
                  right: RFValue(6),
                }}
                source={require("assets/LikeAnimation.json")}
              />
            </TouchableOpacity>

            <View style={{ marginTop: "auto" }}>
              <CustomText variant="h6" fontFamily="gilroyBold" color="white">
                10% OFF
              </CustomText>
              <CustomText
                variant="h7"
                fontFamily="gilroyBold"
                fontSize={RFValue(6)}
                color={"white"}
                style={{
                  opacity: 0.9,
                }}
              >
                UPTO₹40
              </CustomText>
            </View>
          </LinearGradient>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "center", gap: 6 }}>
        <View style={{ position: "absolute", right: 0, top: RFValue(10) }}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={RFValue(18)}
            color={COLORS.darkGray}
          />
        </View>
        <CustomText variant="h5" fontFamily="gilroySemiBold" numberOfLines={1}>
          {item.name}
        </CustomText>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <View
            style={{
              height: RFValue(14),
              width: RFValue(14),
              borderRadius: 20,
              backgroundColor: COLORS.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name="star" size={RFValue(10)} color="white" />
          </View>
          <CustomText variant="h7" fontFamily="gilroyMedium">
            {4.5}
          </CustomText>
          <CustomText variant="h7" fontFamily="gilroyMedium">
            (1.5 KM)
          </CustomText>
          <Text style={{ fontSize: RFValue(4) }}>{"\u2B24"}</Text>
          <CustomText variant="h7" fontFamily="gilroyMedium">
            {item.estimatedDeliveryTime} Mins
          </CustomText>
        </View>
        <CustomText
          variant="h7"
          fontFamily="gilroyRegular"
          numberOfLines={2}
          color={COLORS.darkGray}
          style={{ lineHeight: RFValue(14) }}
        >
          {item.address.addressLine1}
        </CustomText>
      </View>
    </Pressable>
  );
};

export default RecommendedRestaurantListItem;
