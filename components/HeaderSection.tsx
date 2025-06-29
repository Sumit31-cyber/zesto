import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import { BORDER_WIDTH, screenWidth } from "utils/constants";
import CustomText from "./customText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";
import { ImageBackground } from "expo-image";
import OfferCarousel from "./OfferCarousal";

const HeaderSection = ({ headerHeight }: { headerHeight: number }) => {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        width: "100%",
        paddingTop: headerHeight - top,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}
    >
      <ImageBackground
        style={StyleSheet.absoluteFill}
        source={require("assets/images/gbg.jpg")}
      />
      <OfferCarousel />
      {/* <View
        style={{
          flexDirection: "row",
          marginTop: "auto",
          alignItems: "flex-end",
          justifyContent: "space-evenly",
          top: -10,
        }}
      > */}
      {/* <View
          style={{
            height: RFValue(140),
            aspectRatio: 1,
          }}
        >
          <LottieView
            autoPlay
            resizeMode="contain"
            // speed={0.3}
            style={{
              flex: 1,
            }}
            source={require("assets/animations/hAnimation.json")}
          />
        </View>
        <View
          style={{
            marginTop: "auto",
            height: RFValue(70),
            aspectRatio: 1,
            position: "absolute",
            left: 10,
          }}
        >
          <LottieView
            autoPlay
            resizeMode="contain"
            // speed={0.3}
            style={{
              flex: 1,
            }}
            source={require("assets/animations/saladAnimation.json")}
          />
        </View> */}
      {/* <LottieView
          autoPlay
          resizeMode="contain"
          // speed={0.3}
          style={{
            width: screenWidth / 2,
            aspectRatio: 1,
            marginTop: "auto",
          }}
          source={require("assets/animations/saladAnimation.json")}
        />
        <LottieView
          autoPlay
          resizeMode="contain"
          // speed={0.3}
          style={{
            width: screenWidth / 2,
            aspectRatio: 1,
            marginTop: "auto",
          }}
          source={require("assets/animations/hAnimation.json")}
        /> */}
      {/* <LottieView
          autoPlay
          resizeMode="cover"
          speed={0.3}
          style={{
            width: 150,
            aspectRatio: 1,
            marginTop: "auto",
          }}
          source={require("assets/diwaliAnimation.json")}
        /> */}
      {/* </View> */}
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            height: BORDER_WIDTH * 2,
            backgroundColor: "#fff",
            flex: 1,
            marginHorizontal: 20,
          }}
        ></View>
        <CustomText variant="h7" fontFamily="gilroyBold" color={"#fff"}>
          Up To 60% OFF
        </CustomText>
        <View
          style={{
            height: BORDER_WIDTH * 2,
            backgroundColor: "#fff",
            flex: 1,
            marginHorizontal: 20,
          }}
        ></View>
      </View> */}
    </View>
  );
};

export default HeaderSection;
