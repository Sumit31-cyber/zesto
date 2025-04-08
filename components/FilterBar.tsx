import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomText from "./customText";
import { BORDER_WIDTH, COLORS, PADDING_HORIZONTAL } from "utils/constants";
import { FilterIcon } from "assets/svgs/svgs";
import { RFValue } from "react-native-responsive-fontsize";
import { AntDesign } from "@expo/vector-icons";
import { filtersOption } from "utils/dataObject";

const FilterBar = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingVertical: RFValue(10),
        backgroundColor: "white",
      }}
      horizontal
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
          <CustomText variant="h6" color={COLORS.black}>
            Filter
          </CustomText>
          <FilterIcon size={RFValue(14)} tint={COLORS.black} />
        </View>
        <View style={styles.itemContainer}>
          <CustomText variant="h6" color={COLORS.black}>
            Sort by
          </CustomText>
          <AntDesign name="down" size={RFValue(12)} color="black" />
        </View>

        {filtersOption.map((item, index) => {
          return (
            <View key={index.toString()} style={styles.itemContainer}>
              <CustomText variant="h6" color={COLORS.black}>
                {item}
              </CustomText>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default FilterBar;

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.darkGray,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
