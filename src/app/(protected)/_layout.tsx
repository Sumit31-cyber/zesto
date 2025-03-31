import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Slot, Stack } from "expo-router";

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  console.log("Inside Protected Route");

  if (isAuthenticated === undefined) {
    return <Redirect href="/(auth)/signIn" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/signIn" />;
  }

  return <Stack />;
}
