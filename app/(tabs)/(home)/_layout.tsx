import { Stack } from 'expo-router';
import { useSettings } from '@/contexts/SettingsContext';

export default function HomeLayout() {
  const { colors } = useSettings();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="learn" />
    </Stack>
  );
}
