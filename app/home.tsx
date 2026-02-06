import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useSettings } from '@/contexts/SettingsContext';

// This screen now redirects to the main Learn tab
// Keeping it for backwards compatibility with any navigation that points here
export default function HomeScreen() {
  const { colors } = useSettings();

  // Use Redirect for immediate navigation to Learn tab
  return <Redirect href="/(tabs)/(home)/learn" />;
}
