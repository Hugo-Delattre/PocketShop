import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ComponentType, useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import useAuth from "../hooks/auth";
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
import { useAtomValue } from "jotai";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayout() {
  const colorScheme = useColorScheme();

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

  if (!loaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile"
            options={{
              title: "Mon Profil",
              headerShown: true,
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <PayPalRedirectHandler />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default RootLayout;
