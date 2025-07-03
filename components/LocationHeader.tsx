import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import CustomText from "./customText";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { selectUserAddresses } from "redux/slice/userSlice";
import { clearAllPersistedData } from "redux/store";
import { BrainCircuit, ChevronDown, MapPin, Power } from "lucide-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

type Props = {
  titleStyle?: TextStyle;
  locationTextStyle?: TextStyle;
};
const LocationHeader: React.FC<Props> = ({ titleStyle, locationTextStyle }) => {
  const { signOut } = useAuth();
  const userAddress = useSelector(selectUserAddresses);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "signout",
        style: "destructive",
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
        activeOpacity={0.8}
        onPress={() => {
          router.navigate("/(protected)/zAgent");
        }}
        style={{
          alignSelf: "flex-start",
          backgroundColor: "rgba(0,0,0,0.3)",
          borderRadius: 100,
          height: RFValue(28),
          aspectRatio: 1,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={["#2e466290", `#56cba190`]}
          style={[StyleSheet.absoluteFill]}
        ></LinearGradient>

        <BrainCircuit size={RFValue(12)} color="white" strokeWidth={2.8} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
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
    </View>
  );
};

export default LocationHeader;

const styles = StyleSheet.create({});
