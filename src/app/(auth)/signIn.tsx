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
import { useAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { BlurView } from "expo-blur";

const topContainerHeight = screenHeight * 0.4;
const bottomContainerHeight = screenHeight * 0.6;
const backgroundImageOpacity = 0.7;
const SignInScreen = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, setActive, isLoaded } = useSignUp();
  const { signIn, setActive: setSignInActive } = useSignIn();
  const { isSignedIn } = useAuth();

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isKeyboardVisible ? -screenHeight * 0.15 : 0, {
            duration: 300,
          }),
        },
      ],
    };
  });

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSignIn = async (): Promise<void> => {
    // Input validation
    if (!phoneNumber?.trim()) {
      Alert.alert(
        "Missing Phone Number",
        "Please enter your phone number to continue."
      );
      return;
    }

    // Service readiness check
    if (!isLoaded) {
      Alert.alert("Please wait", "Authentication service is not ready yet.");
      return;
    }

    // Format phone number with country code
    const phoneNumberWithCountryCode = `+12${phoneNumber.trim()}`;

    // Dismiss keyboard and start loading
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      // Attempt sign-in
      const signInResponse = await signIn?.create({
        identifier: phoneNumberWithCountryCode,
      });

      console.log("SignIn status:", signInResponse?.status);

      // Handle complete sign-in
      if (signInResponse?.status === "complete") {
        if (signInResponse.createdSessionId) {
          await setActive({ session: signInResponse.createdSessionId });
          router.replace("/(protected)/(tabs)/food");
        } else {
          throw new Error("Session ID not found in sign-in response");
        }
        return;
      }

      // Handle first factor authentication
      if (signInResponse?.status === "needs_first_factor") {
        console.log("Preparing first factor...");

        // Find phone code factor
        const phoneFactor = signInResponse.supportedFirstFactors?.find(
          (factor) => factor.strategy === "phone_code"
        );

        if (!phoneFactor) {
          throw new Error("Phone code strategy not supported for this number.");
        }

        // Prepare first factor
        await signIn?.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId: phoneFactor.phoneNumberId,
        });

        // Attempt first factor with dev code
        const result = await signIn?.attemptFirstFactor({
          strategy: "phone_code",
          code: "424242", // Dev-only code
        });

        console.log("First factor result:", result);

        // Handle successful first factor
        if (result?.status === "complete") {
          if (result.createdSessionId) {
            await setActive({ session: result.createdSessionId });
            router.replace("/(protected)/(tabs)/food");
          } else {
            throw new Error("Session ID not found in first factor result");
          }
        } else {
          throw new Error(
            `First factor authentication failed with status: ${result?.status}`
          );
        }
        return;
      }

      // Handle unexpected sign-in status
      throw new Error(`Unexpected sign-in status: ${signInResponse?.status}`);
    } catch (signInError) {
      console.warn("SignIn error:", signInError);
      console.log("Phone number not found, attempting registration...");

      try {
        // Attempt sign-up
        const signUpResponse = await signUp?.create({
          phoneNumber: phoneNumberWithCountryCode,
        });

        console.log("SignUp status:", signUpResponse?.status);

        // Handle complete sign-up
        if (signUpResponse?.status === "complete") {
          if (signUpResponse.createdSessionId) {
            await setActive({ session: signUpResponse.createdSessionId });
            router.replace("/(protected)/(tabs)/food");
          } else {
            throw new Error("Session ID not found in sign-up response");
          }
        } else {
          // Handle incomplete registration
          Alert.alert(
            "Registration Incomplete",
            `Please complete the registration. Status: ${
              signUpResponse?.status || "Unknown"
            }`
          );
        }
      } catch (signUpError) {
        console.error("SignUp error:", signUpError);

        // Enhanced error handling for sign-up
        const errorMessage =
          signUpError instanceof Error
            ? signUpError.message
            : typeof signUpError === "string"
            ? signUpError
            : "An unexpected error occurred during registration";

        Alert.alert("Registration Failed", errorMessage);
      }
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  // const handleSignIn = async () => {
  //   if (!phoneNumber) {
  //     Alert.alert(
  //       "Missing Phone Number",
  //       "Please enter your phone number to continue."
  //     );
  //     return;
  //   }

  //   if (!isLoaded) {
  //     Alert.alert("Please wait", "Authentication service is not ready yet.");
  //     return;
  //   }

  //   // const phoneNumberWithCountryCode = `+91${phoneNumber}`;
  //   const phoneNumberWithCountryCode = `+12${phoneNumber}`;
  //   Keyboard.dismiss();
  //   setIsLoading(true);

  //   try {
  //     // Attempt sign-in
  //     const signInResponse = await signIn?.create({
  //       identifier: phoneNumberWithCountryCode,
  //     });

  //     console.log("SignIn status:", signInResponse?.status);

  //     if (signInResponse?.status === "complete") {
  //       setActive({ session: signInResponse.createdSessionId });
  //       router.replace("/(protected)/(tabs)/food");
  //       return;
  //     }

  //     if (signInResponse?.status === "needs_first_factor") {
  //       console.log("Preparing first factor...");

  //       const phoneFactor = signInResponse.supportedFirstFactors?.find(
  //         (factor) => factor.strategy === "phone_code"
  //       );

  //       if (!phoneFactor) {
  //         throw new Error("Phone code strategy not supported for this number.");
  //       }

  //       await signIn?.prepareFirstFactor({
  //         strategy: "phone_code",
  //         phoneNumberId: phoneFactor.phoneNumberId,
  //       });

  //       const result = await signIn?.attemptFirstFactor({
  //         strategy: "phone_code",
  //         code: "424242", // Dev-only code
  //       });

  //       console.log("First factor result:", result);

  //       if (result?.status === "complete") {
  //         setActive({ session: result.createdSessionId });
  //         router.replace("/(protected)/(tabs)/food");
  //         return;
  //       }
  //     }
  //   } catch (signInError) {
  //     console.warn("SignIn error:", signInError);
  //     console.log("Phone number not found, attempting registration...");

  //     try {
  //       const signUpResponse = await signUp?.create({
  //         phoneNumber: phoneNumberWithCountryCode,
  //       });

  //       if (signUpResponse?.status === "complete") {
  //         setActive({ session: signUpResponse.createdSessionId });
  //         router.replace("/(protected)/(tabs)/food");
  //       } else {
  //         Alert.alert(
  //           "Registration Incomplete",
  //           "Please complete the registration."
  //         );
  //       }
  //     } catch (signUpError) {
  //       console.error("SignUp error:", signUpError);
  //       Alert.alert(
  //         "Registration failed",
  //         signUpError instanceof Error
  //           ? signUpError.message
  //           : String(signUpError)
  //       );
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  if (isSignedIn) {
    return <Redirect href={"/(protected)/(tabs)/food"} />;
  }
  return (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={{ flex: 1 }}
    >
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
                contentFit="contain"
                style={{
                  height: RFValue(100),
                  aspectRatio: 1,
                }}
                transition={300}
                source={require("assets/images/pngIcon.png")}
              />
              <CustomText
                variant="h4"
                color={COLORS.extraDarkGray}
                fontFamily="gilroyMedium"
                style={{ letterSpacing: 0.8 }}
              >
                Hungry? Let Zesto Handle It!
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
              // backgroundColor: "white",
              marginTop: "auto",
              padding: RFValue(14),
              zIndex: 100,
            },
          ]}
        >
          <BlurView style={StyleSheet.absoluteFill} />
          <CustomText
            variant="h4"
            fontFamily="gilroyBold"
            style={{ letterSpacing: 0.8, marginBottom: 5 }}
          >
            LOGIN
          </CustomText>
          <CustomText
            variant="h7"
            fontFamily="gilroyLight"
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
        overflow: "hidden",
      }}
    >
      <View
        style={[
          {
            height: topContainerHeight + 100,
            width: "100%",
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.1)",
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
