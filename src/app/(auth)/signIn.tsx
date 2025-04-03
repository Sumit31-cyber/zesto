import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  Alert,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTS, screenHeight, screenWidth } from "utils/constants";
import { Image } from "expo-image";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "components/customText";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Redirect, router } from "expo-router";
import CustomButton from "components/CustomButton";
import { useAuth, useSignUp } from "@clerk/clerk-expo";

const topContainerHeight = screenHeight * 0.4;
const bottomContainerHeight = screenHeight * 0.6;
const backgroundImageOpacity = 0.5;
const SignInScreen = () => {
  const [isPhoneInputActive, setIsPhoneInputActive] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, setActive, isLoaded } = useSignUp();
  const { isSignedIn } = useAuth();

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(
            isPhoneInputActive ? -screenHeight * 0.15 : 0,
            {
              duration: 300,
            }
          ),
        },
      ],
    };
  });

  const handleSignIn = async () => {
    let phoneNumberWithCOuntryCode = `+91${phoneNumber}`;
    try {
      Keyboard.dismiss();
      setIsLoading(true);
      console.log(isLoaded);
      if (!isLoaded) return;
      if (phoneNumber != undefined) {
        const response = await signUp.create({
          phoneNumber: phoneNumberWithCOuntryCode,
        });

        // const verification = await signUp.preparePhoneNumberVerification({
        //   strategy: "phone_code",
        // });

        setIsLoading(false);
        console.log(JSON.stringify(response, null, 2));
        if (response.status === "complete") {
          router.replace("/(protected)");
        }
        // router.navigate({
        //   pathname: "/(auth)/verification",
        //   params: {
        //     phoneNumber: phoneNumberWithCOuntryCode,
        //   },
        // });
      } else {
        Alert.alert("Please enter correct phone number to continue");
      }
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : String(error));
      setIsLoading(false);
      console.log(error);
    }
  };

  if (isSignedIn) {
    return <Redirect href={"/(protected)"} />;
  }
  return (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle={"light-content"} />
      <View
        style={{
          height: screenHeight,
          width: screenWidth,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            height: topContainerHeight,
            width: "100%",
          }}
        >
          <Backdrop>
            <View
              style={{
                flex: 1,
                zIndex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
                gap: RFValue(20),
                marginBottom: RFValue(20),
              }}
            >
              <Image
                style={{
                  height: RFValue(80),
                  aspectRatio: 1,
                  borderRadius: RFValue(40),
                }}
                transition={300}
                source={require("assets/images/icon.png")}
              />
              <CustomText
                variant="h4"
                color="white"
                style={{ letterSpacing: 0.8 }}
              >
                Hungry? Let Grabby Handle It!
              </CustomText>
            </View>
          </Backdrop>
        </View>

        <Animated.View
          style={[
            rStyle,
            {
              height: bottomContainerHeight,
              width: "100%",
              backgroundColor: "white",
              marginTop: "auto",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: RFValue(14),
              zIndex: 100,
            },
          ]}
        >
          <CustomText
            variant="h4"
            fontFamily="aeonikBold"
            style={{ letterSpacing: 0.8, marginBottom: 5 }}
          >
            LOGIN
          </CustomText>
          <CustomText
            variant="h7"
            fontFamily="aeonikLight"
            style={{ letterSpacing: 0.8 }}
          >
            Please enter your email and password to login
          </CustomText>

          <View style={{ flexDirection: "row", marginTop: 30, gap: 20 }}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 10,
                borderWidth: StyleSheet.hairlineWidth * 2,
                borderColor: COLORS.gray,
              }}
            >
              <CustomText variant="h4">🇮🇳{"  "}+91</CustomText>
            </View>

            <TextInput
              placeholder="Mobile number"
              value={phoneNumber}
              onChangeText={(value) => {
                setPhoneNumber(value);
              }}
              onFocus={() => {
                setIsPhoneInputActive(true);
              }}
              onBlur={() => {
                setIsPhoneInputActive(false);
              }}
              maxLength={10}
              keyboardType="number-pad"
              style={{
                flex: 1,
                borderBottomWidth: StyleSheet.hairlineWidth * 2,
                borderBottomColor: COLORS.gray,
                fontFamily: FONTS.Regular,
                fontSize: RFValue(16),
                letterSpacing: 1,
              }}
            />
          </View>
          <CustomButton
            title="CONTINUE"
            onPress={handleSignIn}
            showLoader={isLoading}
            loaderColor="white"
            style={{
              marginVertical: 20,
            }}
          />

          <Text
            style={{
              textAlign: "center",
              fontFamily: FONTS.Regular,
              fontSize: RFValue(10),
              color: COLORS.darkGray,
            }}
          >
            By clinking, I accept the{" "}
            <Text style={{ fontFamily: FONTS.Bold, color: "black" }}>
              Terms & Conditions{" "}
              <Text
                style={{ fontFamily: FONTS.Regular, color: COLORS.darkGray }}
              >
                and
              </Text>{" "}
              <Text style={{ fontFamily: FONTS.Bold, color: "black" }}>
                Privacy Policy
              </Text>
            </Text>
          </Text>

          <CustomText
            variant="h7"
            color={COLORS.darkGray}
            style={{ textAlign: "center", marginVertical: RFValue(15) }}
          >
            Or continue with
          </CustomText>
          <SocialMediaButtons />
        </Animated.View>
      </View>
    </Pressable>
  );
};

export default SignInScreen;

const SocialMediaButtons = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        gap: RFValue(20),
      }}
    >
      <View style={styles.socialMediaButtonContainer}>
        <Image
          transition={300}
          source={require("assets/images/google.png")}
          style={{ height: RFValue(20), aspectRatio: 1 }}
        />
      </View>
      <View style={styles.socialMediaButtonContainer}>
        <Image
          transition={300}
          source={require("assets/images/facebook.png")}
          style={{ height: RFValue(20), aspectRatio: 1 }}
        />
      </View>
      <View style={styles.socialMediaButtonContainer}>
        <Image
          transition={300}
          source={require("assets/images/apple.png")}
          style={{ height: RFValue(20), aspectRatio: 1 }}
        />
      </View>
    </View>
  );
};

const Backdrop = ({ children }: { children: React.ReactNode }) => {
  return (
    <View
      style={{
        flex: 1,
        height: topContainerHeight,
        width: "100%",
        position: "absolute",
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        overflow: "hidden",
      }}
    >
      <View
        style={[
          {
            height: topContainerHeight + 100,
            width: "100%",
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        ]}
      ></View>
      <Image
        style={{
          height: RFValue(200),
          aspectRatio: 1,
          opacity: backgroundImageOpacity,
          position: "absolute",
        }}
        transition={300}
        source={require("assets/images/burgerPng.png")}
      />
      <Image
        style={{
          height: RFValue(200),
          aspectRatio: 1,
          opacity: backgroundImageOpacity,
          position: "absolute",
          bottom: 0,
          right: -RFValue(200) / 2,
        }}
        transition={300}
        source={require("assets/images/bowlPng.png")}
      />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  socialMediaButtonContainer: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignSelf: "flex-start",
    padding: 10,
    borderColor: "rgba(15, 183, 88, 0.2)",
    borderRadius: 100,
    backgroundColor: "rgba(15, 183, 88, 0.1)",
  },
});
