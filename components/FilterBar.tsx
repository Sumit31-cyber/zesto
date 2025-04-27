import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import CustomText from "./customText";
import { BORDER_WIDTH, COLORS, PADDING_HORIZONTAL } from "utils/constants";
import { FilterIcon, OfferIcon } from "assets/svgs/svgs";
import { RFValue } from "react-native-responsive-fontsize";
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { filtersOption } from "utils/dataObject";
import { Image } from "expo-image";

export const FILTER_HEIGHT = RFValue(42);
const FilterBar = () => {
  return (
    <View
      style={{ height: FILTER_HEIGHT, width: "100%", backgroundColor: "white" }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: PADDING_HORIZONTAL,
          paddingVertical: RFValue(10),
        }}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: RFValue(8),
          }}
        >
          <View style={styles.itemContainer}>
            <Title title="Filter" />
            <FilterIcon size={RFValue(12)} tint={COLORS.black} />
          </View>
          <View style={styles.itemContainer}>
            <Title title="Sort by" />
            <AntDesign name="down" size={RFValue(12)} color="black" />
          </View>

          {filtersOption.map((item, index) => {
            return (
              <View key={index.toString()} style={styles.itemContainer}>
                {item === "veg" && (
                  <Image
                    style={{ height: "60%", aspectRatio: 1 }}
                    source={require("assets/images/vegIcon.png")}
                  />
                )}
                {item === "Non-veg" && (
                  <Image
                    style={{ height: "60%", aspectRatio: 1 }}
                    source={require("assets/images/nonvegIcon.png")}
                  />
                )}
                {item === "Great Offers" && (
                  <OfferIcon
                    size={RFValue(14)}
                    tint="#7678ed"
                    strokeWidth={1.2}
                  />
                )}
                {item === "Nearest" && (
                  <FontAwesome6
                    name="location-dot"
                    size={RFValue(12)}
                    color={"orange"}
                  />
                )}
                {item === "Rating 4.0" && (
                  <AntDesign name="star" size={RFValue(12)} color="#ffd60a" />
                )}
                {(item === "Less Than Rs. 300" ||
                  item === "Grater Than Rs. 600") && (
                  <View
                    style={{
                      backgroundColor: "#c670ff",
                      height: RFValue(14),
                      aspectRatio: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 100,
                    }}
                  >
                    <FontAwesome
                      name="rupee"
                      size={RFValue(10)}
                      color="white"
                    />
                  </View>
                )}
                <Title title={item} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default FilterBar;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderWidth: BORDER_WIDTH * 2,
    height: "100%",
    paddingHorizontal: RFValue(10),
    borderColor: COLORS.liteGray,
    borderRadius: 5,
  },
});

const Title = ({ title }: { title: string }) => {
  return (
    <CustomText
      variant="h7"
      color={COLORS.black}
      fontFamily="gilroySemiBold"
      style={{ letterSpacing: 0.6 }}
    >
      {title}
    </CustomText>
  );
};
