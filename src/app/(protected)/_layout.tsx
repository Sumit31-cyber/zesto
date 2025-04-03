import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot, Stack } from "expo-router";

export default function ProtectedLayout() {
  const { isSignedIn } = useAuth();

  // if (!isSignedIn) {
  //   return <Redirect href="/signIn" />;
  // }

  return <Stack />;
}
