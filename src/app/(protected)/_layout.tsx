import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot, Stack } from "expo-router";

export default function ProtectedLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/signIn"} />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="restaurant" />
      <Stack.Screen name="cart" />
    </Stack>
  );
}
