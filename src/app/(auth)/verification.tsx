import {
  Alert,
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
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import OTPInput from "components/otpInput";
import CustomButton from "components/CustomButton";
import { useAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
const padding = screenWidth * 0.05;
const VerificationScreen = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const { signUp, setActive, isLoaded } = useSignUp();
  const { phoneNumber } = useLocalSearchParams();
  const { isSignedIn } = useAuth();
  console.log(isSignedIn);

  const handleVerification = async () => {
    if (!isLoaded) return;
    try {
      const code = String(otp.join(""));
      console.log(typeof code);
      if (code) {
        const response = await signUp.attemptVerification({
          code,
          strategy: "phone_code",
        });

        if (response.status != "complete") {
          Alert.alert("Verification failed please try again");
          return;
        } else {
          router.replace("/(protected)");
        }
        console.log(JSON.stringify(response, null, 2));
      } else {
        Alert.alert("Please enter correct otp");
      }
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : String(error));
    }
  };

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
          Code has been sent to +91-{phoneNumber}
        </CustomText>
        <OTPInput otp={otp} setOtp={setOtp} />
        <CustomText variant="h7">Didn't get OTP code?</CustomText>
        <CustomText variant="h7" color={COLORS.primary}>
          Resend Code
        </CustomText>
        <CustomButton title="VERIFY" onPress={handleVerification} />
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
