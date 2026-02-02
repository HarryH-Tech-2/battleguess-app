import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorScheme } from '@/constants/colors';

const SETTINGS_KEY = 'battleguess_settings';

export type Continent = 'europe' | 'asia' | 'africa' | 'americas' | 'all';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  largerText: boolean;
  selectedContinent: Continent;
  themeMode: ThemeMode;
}

const defaultSettings: AppSettings = {
  vibrationEnabled: true,
  soundEnabled: true,
  reducedMotion: false,
  largerText: false,
  selectedContinent: 'all',
  themeMode: 'system',
};

export const [SettingsProvider, useSettings] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const systemColorScheme = useColorScheme();

  const settingsQuery = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      console.log('[Settings] Loading from storage...');
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppSettings;
        console.log('[Settings] Loaded:', parsed);
        return { ...defaultSettings, ...parsed };
      }
      console.log('[Settings] No stored data, using defaults');
      return defaultSettings;
    },
  });

  const { mutate: saveSettings } = useMutation({
    mutationFn: async (newSettings: AppSettings) => {
      console.log('[Settings] Saving...', newSettings);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      return newSettings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['appSettings'], data);
    },
  });

  const saveSettingsRef = useRef(saveSettings);
  saveSettingsRef.current = saveSettings;

  useEffect(() => {
    if (settingsQuery.data) {
      setSettings(settingsQuery.data);
    }
  }, [settingsQuery.data]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      saveSettingsRef.current(newSettings);
      return newSettings;
    });
  }, []);

  const toggleVibration = useCallback(() => {
    updateSettings({ vibrationEnabled: !settings.vibrationEnabled });
  }, [settings.vibrationEnabled, updateSettings]);

  const toggleSound = useCallback(() => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  }, [settings.soundEnabled, updateSettings]);

  const toggleReducedMotion = useCallback(() => {
    updateSettings({ reducedMotion: !settings.reducedMotion });
  }, [settings.reducedMotion, updateSettings]);

  const toggleLargerText = useCallback(() => {
    updateSettings({ largerText: !settings.largerText });
  }, [settings.largerText, updateSettings]);

  const setContinent = useCallback((continent: Continent) => {
    updateSettings({ selectedContinent: continent });
  }, [updateSettings]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    updateSettings({ themeMode: mode });
  }, [updateSettings]);

  // Determine the actual theme based on settings and system preference
  const isDarkMode = settings.themeMode === 'dark' ||
    (settings.themeMode === 'system' && systemColorScheme === 'dark');

  const colors: ColorScheme = isDarkMode ? darkColors : lightColors;

  return {
    settings,
    isLoading: settingsQuery.isLoading,
    updateSettings,
    toggleVibration,
    toggleSound,
    toggleReducedMotion,
    toggleLargerText,
    setContinent,
    setThemeMode,
    isDarkMode,
    colors,
  };
});
