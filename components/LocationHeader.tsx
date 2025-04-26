import { StyleSheet, Text, TextStyle, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "utils/constants";
import { SendIcon } from "assets/svgs/svgs";
import CustomText from "./customText";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

type Props = {
  titleStyle?: TextStyle;
  locationTextStyle?: TextStyle;
  iconColor?: string;
};
const LocationHeader: React.FC<Props> = ({
  titleStyle,
  locationTextStyle,
  iconColor = "black",
}) => {
  return (
    <View
      style={{
        gap: 2,
        paddingBottom: 6,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
            }}
          >
            <SendIcon size={40} tint={iconColor} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <CustomText
              variant="h3"
              fontFamily="gilroyBold"
              color="black"
              style={titleStyle}
            >
              Phulwari Sharif
            </CustomText>
            <AntDesign name="down" size={18} color="black" />
          </View>
        </View>
        <CustomText
          variant="h6"
          color="black"
          numberOfLines={1}
          style={[{ opacity: 0.8, ...locationTextStyle }]}
        >
          Mitra Mandal Colony, Nagar Nigam Colony, PhulwariSharif, near Shiv
          Mandir
        </CustomText>
      </View>
      <View
        style={{
          height: 40,
          width: 60,
          backgroundColor: COLORS.black,
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 14,
        }}
      >
        <FontAwesome name="user" size={24} color="white" />
      </View>
    </View>
  );
};

export default LocationHeader;

const styles = StyleSheet.create({});
