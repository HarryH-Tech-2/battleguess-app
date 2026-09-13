import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';

export default function IndexScreen() {
  const { progress, isLoading } = useUserProgress();
  const { colors } = useSettings();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.brass} />
      </View>
    );
  }

  if (progress.hasCompletedOnboarding) {
    return <Redirect href="/(tabs)/(home)/learn" />;
  }

  return <Redirect href="/onboarding" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
