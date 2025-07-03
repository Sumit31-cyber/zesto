import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import {
  BORDER_WIDTH,
  COLORS,
  PADDING_HORIZONTAL,
  screenHeight,
  screenWidth,
} from "utils/constants";
import { Image } from "expo-image";
import CustomText from "./customText";

const InitialAgentView = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: RFValue(10),
      }}
    >
      <View
        style={{
          height: RFValue(100),
          aspectRatio: 1,
          backgroundColor: `${COLORS.primary}10`,
          borderRadius: RFValue(100),
          borderWidth: 1,
          borderColor: `${COLORS.primary}40`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: "70%",
            aspectRatio: 1,
            backgroundColor: `${COLORS.primary}20`,
            borderRadius: RFValue(100),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{ height: "40%", aspectRatio: 1 }}
            source={require("assets/images/pngIcon.png")}
          />
        </View>
      </View>
      <View style={{ alignItems: "center", justifyContent: "center", gap: 5 }}>
        <CustomText variant="h3" fontFamily="gilroySemiBold">
          Hi, I'm Zesto
        </CustomText>
        <CustomText variant="h7">How can i assist you today?</CustomText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: PADDING_HORIZONTAL }}
        style={{
          height: screenHeight * 0.2,
          flexGrow: 0,
          flexWrap: "wrap",
          minWidth: screenWidth,

          marginVertical: RFValue(20),
        }}
      >
        <View style={{ gap: 10 }}>
          <View
            style={{
              gap: 10,
              flexDirection: "row",
            }}
          >
            {assistMessageExamples.slice(0, 4).map((item, index) => {
              return <ListItems key={item} title={item} />;
            })}
          </View>
          <View
            style={{
              gap: 10,
              flexDirection: "row",
            }}
          >
            {assistMessageExamples.slice(4, 8).map((item, index) => {
              return <ListItems key={item} title={item} />;
            })}
          </View>
          <View
            style={{
              gap: 10,
              flexDirection: "row",
            }}
          >
            {assistMessageExamples.slice(8, 12).map((item, index) => {
              return <ListItems key={item} title={item} />;
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default InitialAgentView;

const styles = StyleSheet.create({});

const ListItems = ({ title }: { title: string }) => {
  return (
    <View
      style={{
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingVertical: 10,
        borderWidth: BORDER_WIDTH,
        borderColor: `${COLORS.primary}50`,
        borderRadius: 100,
        backgroundColor: `${COLORS.primary}10`,
      }}
    >
      <CustomText variant="h7" color={COLORS.black}>
        {title}
      </CustomText>
    </View>
  );
};

const assistMessageExamples = [
  "Order food",
  "Food suggestions",
  "Restaurants nearby",
  "Pending orders",
  "Top rated food",
  "User information",
  "Cancel order",
  "Rate food",
  "Track order",
  "Add address",
  "Register complaint",
  "Change address",
  "View menu",
  "Order history",
  "Reorder food",
  "Search restaurant",
  "Delivery status",
  "Leave review",
  "Apply coupon",
  "Delivery tip",
  "Edit profile",
  "Payment details",
  "Contact support",
  "Missing item",
  "Vegan options",
  "Best sellers",
  "Fast delivery",
  "Late night",
  "Popular dishes",
  "Saved address",
];
