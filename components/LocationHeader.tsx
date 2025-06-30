import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { COLORS } from "utils/constants";
import { SendIcon } from "assets/svgs/svgs";
import CustomText from "./customText";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { selectUserAddresses } from "redux/slice/userSlice";
import { clearAllPersistedData } from "redux/store";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import { RFValue } from "react-native-responsive-fontsize";

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
  const { signOut, userId } = useAuth();
  const userAddress = useSelector(selectUserAddresses);
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
            alignItems: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: 100,
              height: RFValue(28),
              aspectRatio: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MapPin color={"white"} size={RFValue(12)} />
          </View>
          <View style={{ gap: 4, flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <CustomText
                variant="h4"
                fontFamily="gilroyBold"
                color="black"
                style={titleStyle}
              >
                Phulwari Sharif
              </CustomText>
              <AntDesign name="down" size={18} color="black" />
            </View>
            <CustomText
              variant="h7"
              color="black"
              numberOfLines={1}
              style={[{ opacity: 0.8, ...locationTextStyle }]}
            >
              {userAddress[0]?.addressLine1}
            </CustomText>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={async () => {
          clearAllPersistedData();
          await signOut();
        }}
        style={{
          alignSelf: "flex-start",
          backgroundColor: "rgba(0,0,0,0.3)",
          borderRadius: 100,
          height: RFValue(28),
          aspectRatio: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FontAwesome name="user" size={RFValue(12)} color="white" />
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={async () => {
          // clearAllPersistedData();
          // await signOut();

          router.navigate("/activeOrderDetailScreen");
        }}
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
       
      </TouchableOpacity> */}
    </View>
  );
};

export default LocationHeader;

const styles = StyleSheet.create({});
