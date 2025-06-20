import { useAuth } from "@clerk/clerk-expo";
import { useSharedState } from "context/sharedContext";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";
import { io } from "socket.io-client";
import { SOCKET_URL } from "utils/ApiManager";

export default function ProtectedLayout() {
  const { isSignedIn, userId } = useAuth();
  const { setSocketClient } = useSharedState();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/signIn"} />;
  }

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      query: {
        userId: userId,
      },
    });

    newSocket.on("order_status", (data) => {
      console.log(data);
      Alert.alert(data.message);
    });
    setSocketClient(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="restaurant" />
      <Stack.Screen name="cart" />
    </Stack>
  );
}
