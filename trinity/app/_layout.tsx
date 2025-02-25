import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ImageBackground } from "react-native";
import React from "react";
import useAuth from "../hooks/auth";
import LoginScreen from "@/screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtomValue } from "jotai";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { atomIsAuthenticated } = useAuth();
  const isAuthenticated = useAtomValue(atomIsAuthenticated);
  console.log("is authenticated", isAuthenticated);
  AsyncStorage.clear();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (!isAuthenticated) {
    return <LoginScreen />; // Render the login screen if the user is not authenticated
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
