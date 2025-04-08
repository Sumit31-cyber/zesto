import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { View } from "react-native";
import { BORDER_WIDTH } from "utils/constants";
import CustomText from "./customText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HeaderSection = ({ headerHeight }: { headerHeight: number }) => {
  const { top } = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={["#fdf9ed", "#faedcd", "#f4d893"]}
      style={{
        width: "100%",
        paddingTop: headerHeight - top,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          marginTop: "auto",
          alignItems: "flex-end",
          justifyContent: "space-between",
          top: -10,
        }}
      >
        <LottieView
          autoPlay
          resizeMode="cover"
          speed={0.3}
          style={{
            width: 180,
            height: 100,
            marginTop: "auto",
          }}
          source={require("assets/diwaliText.json")}
        />
        <LottieView
          autoPlay
          resizeMode="cover"
          speed={0.3}
          style={{
            width: 150,
            aspectRatio: 1,
            marginTop: "auto",
          }}
          source={require("assets/diwaliAnimation.json")}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            // width: "100%",
            height: BORDER_WIDTH,
            backgroundColor: "#e3871d",
            flex: 1,
            marginHorizontal: 20,
          }}
        ></View>
        <CustomText variant="h7" color={"#e3871d"}>
          Up To 60% OFF
        </CustomText>
        <View
          style={{
            // width: "100%",
            height: BORDER_WIDTH,
            backgroundColor: "#e3871d",
            flex: 1,
            marginHorizontal: 20,
          }}
        ></View>
      </View>
    </LinearGradient>
  );
};

export default HeaderSection;
