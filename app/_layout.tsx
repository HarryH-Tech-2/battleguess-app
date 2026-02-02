import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProgressProvider } from "@/contexts/UserProgressContext";
import { SettingsProvider, useSettings } from "@/contexts/SettingsContext";
import { lightColors } from "@/constants/colors";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { colors } = useSettings();

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textInverse,
        headerTitleStyle: { fontWeight: "600" as const },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="lesson-complete" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="review" options={{ title: "Daily Review" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="privacy-policy" options={{ title: "Privacy Policy" }} />
      <Stack.Screen name="terms-of-service" options={{ title: "Terms of Service" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserProgressProvider>
          <SettingsProvider>
            <RootLayoutNav />
          </SettingsProvider>
        </UserProgressProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
