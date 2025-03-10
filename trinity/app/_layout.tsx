import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import useAuth, { loadableUserAtom } from "../hooks/auth";
import LoginScreen from "@/screens/LoginScreen";
import { useAtomValue } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Karla_400Regular,
  Karla_500Medium,
  Karla_600SemiBold,
  Karla_700Bold,
} from "@expo-google-fonts/karla";
import { CrimsonText_400Regular } from "@expo-google-fonts/crimson-text";
import { Text } from "react-native";
import PayPalRedirectHandler from "@/components/PaypalRedirectHandler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { atomIsAuthenticated, getUserTokenFromStorage } = useAuth();
  const isAuthenticated = useAtomValue(atomIsAuthenticated);
  const connectedUser = useAtomValue(loadableUserAtom);

  const [loaded] = useFonts({
    Karla_400Regular,
    Karla_600SemiBold,
    Karla_500Medium,
    Karla_700Bold,
    CrimsonText_400Regular,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || connectedUser.state === "loading") {
    return <Text>Loading...</Text>;
  }

  if (!isAuthenticated) {
    return <LoginScreen />; // Render the login screen if the user is not authenticated
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NavigationContainer>
        <PayPalRedirectHandler />
      </NavigationContainer>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
