import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Compass } from 'lucide-react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { fonts } from '@/constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();
  const { colors } = useSettings();
  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Compass size={56} color={colors.brass} />
        <Text style={[styles.title, { color: colors.text }]}>Uncharted territory</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>This battle has not been discovered yet.</Text>
        <ChunkyButton label="Return to camp" variant="brass" onPress={() => router.replace('/')} block={false} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontFamily: fonts.display, fontSize: 26, textAlign: 'center' },
  subtitle: { fontFamily: fonts.bodySemi, fontSize: 15, textAlign: 'center', marginBottom: 12 },
});
