import { Stack } from 'expo-router';
import { useSettings } from '@/contexts/SettingsContext';

export default function HomeLayout() {
  const { colors } = useSettings();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textInverse,
        headerTitleStyle: { fontWeight: '600' as const },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="learn"
        options={{
          title: 'Home',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
