import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useRef, useState } from "react";
import { BORDER_WIDTH, COLORS, FONTS } from "utils/constants";
import Animated from "react-native-reanimated";

const numberOfInput = 6;
type props = {
  otp: string[];
  setOtp: (value: string[]) => void;
};
const OtpInput = ({ otp, setOtp }: props) => {
  // const [otp, setOtp] = useState(Array(numberOfInput).fill(""));
  const textInputRef = useRef<TextInput[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleChange = (value: string, index: number) => {
    if (index < numberOfInput) {
      const newArray = [...otp];
      newArray[index] = value;
      setOtp(newArray);
      if (value != "" && index <= numberOfInput)
        textInputRef.current[index + 1]?.focus();
    }
  };

  const handleBackPress = (key: string, index: number) => {
    if (otp[index] != "" && key != "Backspace") {
      textInputRef.current[index + 1]?.focus();
      handleChange(key, index + 1);
    }
    if (key === "Backspace" && index > 0) {
      if (index === numberOfInput) {
        handleChange("", index - 1);
      } else {
        if (otp[index] == "") {
          textInputRef.current[index - 1]?.focus();
          handleChange("", index - 1);
          return;
        }
        textInputRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <Pressable
      onPress={() => {
        textInputRef.current[focusedIndex]?.focus();
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
        gap: 14,
      }}
    >
      {otp.map((item, index) => {
        return (
          <TextInput
            pointerEvents="none"
            key={index}
            caretHidden={true}
            placeholder="-"
            placeholderTextColor={COLORS.primary}
            ref={(input) => input && (textInputRef.current[index] = input)}
            maxLength={1}
            autoFocus={index == 0}
            onFocus={() => setFocusedIndex(index)}
            inputMode="numeric"
            keyboardType="numeric"
            value={otp[index]}
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={(e) => handleBackPress(e.nativeEvent.key, index)}
            style={{
              fontSize: 25,
              width: 50,
              aspectRatio: 1,
              textAlign: "center",
              backgroundColor: otp[index] ? COLORS.primary : "white",
              borderRadius: 10,
              fontFamily: FONTS.Regular,
              borderWidth: otp[index] ? 0 : BORDER_WIDTH,
              borderColor:
                focusedIndex === index
                  ? COLORS.primary
                  : "rgba(15, 183, 88,0.4)",
              color: "white",
            }}
          />
        );
      })}
    </Pressable>
  );
};

export default OtpInput;

const styles = StyleSheet.create({});

// import { useRef, useState, type RefObject } from "react";
// import { TextInput, View, StyleSheet } from "react-native";

// interface OTPInputProps {
//   codes: string[];
//   refs: RefObject<TextInput>[];
//   errorMessages: string[] | undefined;
//   config: OTPInputConfig;
// }

// interface OTPInputConfig {
//   backgroundColor: string;
//   textColor: string;
//   borderColor: string;
//   errorColor: string;
//   focusColor: string;
// }

// export default function OTPInput({}: OTPInputProps) {
//   const [codes, setCodes] = useState<string[] | undefined>(Array(6).fill(""));
//   const refs: RefObject<TextInput>[] = [
//     useRef<TextInput>(null),
//     useRef<TextInput>(null),
//     useRef<TextInput>(null),
//     useRef<TextInput>(null),
//     useRef<TextInput>(null),
//     useRef<TextInput>(null),
//   ];

//   const onChangeCode = (text: string, index: number) => {
//     const newCodes = [...codes!];
//     newCodes[index] = text;
//     setCodes(newCodes);
//     if (text !== "" && index < 5) {
//       refs[index + 1]!.current?.focus();
//     }
//   };

//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         width: "100%",
//         justifyContent: "space-between",
//       }}
//     >
//       {codes.map((code, index) => (
//         <TextInput
//           key={index}
//           autoComplete="one-time-code"
//           enterKeyHint="next"
//           style={[
//             {
//               fontSize: 16,
//               height: 48,
//               width: 48,
//               borderRadius: 8,
//               textAlign: "center",
//               color: "black",
//               borderColor: "black",
//               borderWidth: 2,
//             },
//           ]}
//           inputMode="numeric"
//           onChangeText={(text) => onChangeCode(text, index)}
//           value={code}
//           maxLength={index === 0 ? codes.length : 1}
//           ref={refs[index]}
//           onKeyPress={({ nativeEvent: { key } }) => {
//             if (key === "Backspace" && index > 0) {
//               onChangeCode("", index - 1);
//               refs[index - 1]!.current!.focus();
//             }
//           }}
//         />
//       ))}
//     </View>
//   );
// }
