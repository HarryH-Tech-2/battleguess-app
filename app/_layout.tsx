import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
import { useFonts } from 'expo-font';
import { Cinzel_700Bold, Cinzel_900Black } from '@expo-google-fonts/cinzel';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import i18n from '@/i18n';
import { UserProgressProvider } from '@/contexts/UserProgressContext';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import { palette } from '@/constants/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { colors, isDarkMode } = useSettings();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        <Stack.Screen name="lesson/[id]" options={{ animation: "slide_from_bottom", gestureEnabled: false }} />
        <Stack.Screen name="lesson-complete" options={{ animation: "fade", gestureEnabled: false }} />
        <Stack.Screen name="battle/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="review" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="settings" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="choose-guide" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="privacy-policy" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="terms-of-service" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Cinzel_700Bold,
    Cinzel_900Black,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: palette.ink }} />;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.ink }}>
          <SettingsProvider>
            <UserProgressProvider>
              <RootLayoutNav />
            </UserProgressProvider>
          </SettingsProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
