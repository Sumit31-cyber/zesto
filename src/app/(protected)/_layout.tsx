import { useAuth } from "@clerk/clerk-expo";
import { useSharedState } from "context/sharedContext";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { changeOrderStatus } from "redux/slice/orderHistorySlice";
import { io } from "socket.io-client";
import { SOCKET_URL } from "utils/ApiManager";

export default function ProtectedLayout() {
  const { isSignedIn, userId } = useAuth();
  const { setSocketClient } = useSharedState();
  const dispatch = useDispatch();

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      query: {
        userId: userId,
      },
    });

    newSocket.on("order_status", (data) => {
      dispatch(
        changeOrderStatus({
          orderId: data.orderId,
          newStatus: data.newStatus,
        })
      );
    });
    setSocketClient(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/signIn"} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="restaurant" />
      <Stack.Screen name="cart" />
      <Stack.Screen name="activeOrderDetailScreen" />
      <Stack.Screen name="orderPlacedScreen" />
      <Stack.Screen name="createUserInformationScreen" />
    </Stack>
  );
}
