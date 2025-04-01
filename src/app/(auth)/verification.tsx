import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { COLORS, screenHeight, screenWidth } from "utils/constants";
import CustomText from "components/customText";
import AntDesign from "@expo/vector-icons/AntDesign";
import { goBack } from "expo-router/build/global-state/routing";
import { router } from "expo-router";
import { Image } from "expo-image";
import OTPInput from "components/otpInput";
import CustomButton from "components/CustomButton";
const padding = screenWidth * 0.05;
const VerificationScreen = () => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          height: screenWidth,
          width: screenWidth * 2,
          top: -screenHeight * 0.27,
          backgroundColor: "rgba(15, 183, 88,0.2)",
          position: "absolute",
          borderBottomLeftRadius: screenHeight,
          borderBottomRightRadius: screenHeight,
          borderCurve: "continuous",
          alignSelf: "center",
        }}
      ></View>
      <Header />
      <View
        style={{
          alignItems: "center",
          marginTop: 80,
          gap: 10,
          paddingHorizontal: 20,
        }}
      >
        <CustomText variant="h4">Verify Phone</CustomText>
        <CustomText variant="h7">
          Code has been sent to +91-1234567890
        </CustomText>
        <OTPInput otp={otp} setOtp={setOtp} />
        <CustomText variant="h7">Didn't get OTP code?</CustomText>
        <CustomText variant="h7" color={COLORS.primary}>
          Resend Code
        </CustomText>
        <CustomButton
          title="VERIFY"
          onPress={() => {
            console.log(otp.join(""));
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({});

const headerHeight = screenHeight * 0.07;
const backButtonSize = headerHeight * 0.25;
const Header = () => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: padding,
        height: headerHeight,
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.8}
        style={{
          height: 40,
          aspectRatio: 1,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: COLORS.darkGray,
          borderRadius: 100,
          position: "absolute",
          left: padding * 0.7,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AntDesign name="left" size={backButtonSize} color="black" />
      </TouchableOpacity>
      <CustomText variant="h3" style={{ letterSpacing: 0.6 }}>
        Verification
      </CustomText>
    </View>
  );
};
