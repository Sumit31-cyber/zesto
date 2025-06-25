import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FavoriteItem, Restaurant } from "types/types";
import { RFValue } from "react-native-responsive-fontsize";
import { Image } from "expo-image";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "utils/constants";
import CustomText from "./customText";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import {
  addItemToFavorite,
  removeItemFromFavorite,
} from "redux/slice/favoriteSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/store";

interface RequiredRestaurantAddressTypes {
  id: string;
  addressLine1: string;
}
interface RequiredRestaurantItemTypes {
  id: string;
  name: string;
  logoUrl: string;
  estimatedDeliveryTime: string;
  address: RequiredRestaurantAddressTypes;
}
type Props = {
  item: RequiredRestaurantItemTypes;
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
  const [isAnimationReady, setIsAnimationReady] = useState(false);

  const isFavorite = favorites.some(
    (option: FavoriteItem) => String(option.id) === String(item.id)
  );

  const handleFavoriteToggle = useCallback(() => {
    if (isFavorite) {
      dispatch(removeItemFromFavorite({ restaurant: item }));
    } else {
      dispatch(addItemToFavorite({ restaurant: item }));
    }
  }, [isFavorite, item, dispatch]);

  useEffect(() => {
    if (!likeAnimationRef.current) return;

    const timer = setTimeout(() => {
      setIsAnimationReady(true);
      if (isFavorite) {
        likeAnimationRef.current?.play(0, 20);
      } else {
        likeAnimationRef.current?.reset();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!likeAnimationRef.current || !isAnimationReady) return;

    if (isFavorite) {
      likeAnimationRef.current.play(0, 20);
    } else {
      likeAnimationRef.current.play(11, 0);
    }
  }, [isFavorite, isAnimationReady]);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          contentFit="cover"
          source={{ uri: item.logoUrl }}
          style={styles.restaurantImage}
        />
        <View style={styles.overlayContainer}>
          <LinearGradient
            start={{ x: 0.5, y: -0.2 }}
            colors={["transparent", "rgba(0,0,0,0.9)"]}
            style={styles.gradient}
          >
            <TouchableOpacity
              onPress={handleFavoriteToggle}
              style={styles.favoriteButton}
              activeOpacity={0.7}
            >
              <LottieView
                ref={likeAnimationRef}
                autoPlay={false}
                loop={false}
                resizeMode="contain"
                speed={0.8}
                style={styles.lottieAnimation}
                source={require("assets/LikeAnimation.json")}
              />
            </TouchableOpacity>

            <View style={styles.discountContainer}>
              <CustomText variant="h6" fontFamily="gilroyBold" color="white">
                10% OFF
              </CustomText>
              <CustomText
                variant="h7"
                fontFamily="gilroyBold"
                fontSize={RFValue(6)}
                color="white"
                style={styles.discountSubtext}
              >
                UPTO₹40
              </CustomText>
            </View>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.menuButton}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={RFValue(18)}
            color={COLORS.darkGray}
          />
        </View>

        <CustomText variant="h5" fontFamily="gilroySemiBold" numberOfLines={1}>
          {item.name}
        </CustomText>

        <View style={styles.ratingContainer}>
          <View style={styles.starContainer}>
            <AntDesign name="star" size={RFValue(10)} color="white" />
          </View>
          <CustomText variant="h7" fontFamily="gilroyMedium">
            4.5
          </CustomText>
          <CustomText variant="h7" fontFamily="gilroyMedium">
            (1.5 KM)
          </CustomText>
          <Text style={styles.bullet}>{"\u2B24"}</Text>
          <CustomText variant="h7" fontFamily="gilroyMedium">
            {item.estimatedDeliveryTime} Mins
          </CustomText>
        </View>

        <CustomText
          variant="h7"
          fontFamily="gilroyRegular"
          numberOfLines={2}
          color={COLORS.darkGray}
          style={styles.address}
        >
          {item.address?.addressLine1 || "No address available"}
        </CustomText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: RFValue(10),
  },
  imageContainer: {
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
  },
  restaurantImage: {
    height: RFValue(120),
    width: "100%",
    borderRadius: 20,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  favoriteButton: {
    zIndex: 100,
    width: RFValue(40),
    height: RFValue(40),
    top: -RFValue(15),
    right: -RFValue(60),
    borderRadius: 100,
  },
  lottieAnimation: {
    width: RFValue(50),
    height: RFValue(50),
    right: RFValue(6),
  },
  discountContainer: {
    marginTop: "auto",
  },
  discountSubtext: {
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  menuButton: {
    position: "absolute",
    right: 0,
    top: RFValue(10),
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  starContainer: {
    height: RFValue(14),
    width: RFValue(14),
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  bullet: {
    fontSize: RFValue(4),
  },
  address: {
    lineHeight: RFValue(14),
    textTransform: "capitalize",
  },
});

export default RecommendedRestaurantListItem;
