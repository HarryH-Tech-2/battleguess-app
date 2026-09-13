import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts } from '@/constants/theme';
import { ScreenBackground } from './ScreenBackground';
import { PageHeader } from './PageHeader';

export interface LegalSection {
  title: string;
  text?: string;
  bullets?: string[];
}

/** Long-form reading page for privacy and terms. */
export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  const insets = useSafeAreaInsets();
  const { colors, fontScale } = useSettings();
  return (
    <ScreenBackground topography={false}>
      <PageHeader title={title} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.updated, { color: colors.textMuted, fontSize: 12 * fontScale }]}>{updated}</Text>
        {sections.map((s, i) => (
          <View key={i} style={styles.section}>
            <Text style={[styles.h2, { color: colors.brass, fontSize: 17 * fontScale }]}>{s.title}</Text>
            {s.text ? <Text style={[styles.p, { color: colors.text, fontSize: 15 * fontScale }]}>{s.text}</Text> : null}
            {s.bullets?.map((b, j) => (
              <View key={j} style={styles.bullet}>
                <View style={[styles.dot, { backgroundColor: colors.brass }]} />
                <Text style={[styles.p, { color: colors.text, fontSize: 15 * fontScale, flex: 1 }]}>{b}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 8, gap: 22 },
  updated: { fontFamily: fonts.bodySemi },
  section: { gap: 8 },
  h2: { fontFamily: fonts.display },
  p: { fontFamily: fonts.body, lineHeight: 23 },
  bullet: { flexDirection: 'row', gap: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 9 },
});
