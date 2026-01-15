import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserProgress } from '@/contexts/UserProgressContext';
import Colors from '@/constants/colors';

export default function IndexScreen() {
  const router = useRouter();
  const { progress, isLoading } = useUserProgress();

  useEffect(() => {
    if (!isLoading) {
      console.log('[Index] Checking onboarding status:', progress.hasCompletedOnboarding);
      if (progress.hasCompletedOnboarding) {
        router.replace('/home');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isLoading, progress.hasCompletedOnboarding, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
