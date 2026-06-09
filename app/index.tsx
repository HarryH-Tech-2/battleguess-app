import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useUserProgress } from '@/contexts/UserProgressContext';
import Colors from '@/constants/colors';

export default function IndexScreen() {
  const { progress, isLoading } = useUserProgress();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  console.log('[Index] Checking onboarding status:', progress.hasCompletedOnboarding);

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
    backgroundColor: Colors.background,
  },
});
