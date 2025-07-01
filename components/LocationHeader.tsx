import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "utils/constants";
import { SendIcon } from "assets/svgs/svgs";
import CustomText from "./customText";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { selectUser, selectUserAddresses } from "redux/slice/userSlice";
import { clearAllPersistedData } from "redux/store";
import { router } from "expo-router";
import {
  ChevronDown,
  MapPin,
  Power,
  SquareChevronDown,
} from "lucide-react-native";
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
  const userInformation = useSelector(selectUser);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            setSigningOut(true);
            await signOut();
            clearAllPersistedData();
            setSigningOut(false);
          } catch (error) {
            setSigningOut(false);
            console.error("Sign out error:", error);
            Alert.alert("Error", "Something went wrong. Please try again!");
          }
        },
      },
    ]);
  };

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
                variant="h6"
                fontFamily="gilroyBold"
                color="black"
                style={titleStyle}
              >
                {/* {userInformation?.firstName} {userInformation?.lastName} */}
                Home
              </CustomText>
              <ChevronDown size={RFValue(14)} color="black" />
            </View>
            <CustomText
              variant="h7"
              color="black"
              numberOfLines={1}
              style={[{ opacity: 0.8, ...locationTextStyle }]}
            >
              {userAddress[0]?.addressLine1}, {userAddress[0]?.city}{" "}
            </CustomText>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
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
        {signingOut ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <Power size={RFValue(12)} color="white" strokeWidth={2.8} />
        )}
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
