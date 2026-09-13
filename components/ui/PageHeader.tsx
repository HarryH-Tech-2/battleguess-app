import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts } from '@/constants/theme';
import { tap } from '@/utils/haptics';

/** Simple back-arrow header for secondary screens. */
export function PageHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors, fontScale, haptics } = useSettings();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={() => {
          if (haptics) tap();
          router.back();
        }}
        style={[styles.btn, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
      >
        <ArrowLeft size={22} color={colors.text} />
      </Pressable>
      <Text style={[styles.title, { color: colors.text, fontSize: 20 * fontScale }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.btnSlot}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  btn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSlot: { width: 42, alignItems: 'flex-end' },
  title: { fontFamily: fonts.display, flex: 1, textAlign: 'center' },
});
