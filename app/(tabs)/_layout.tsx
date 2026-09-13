import React from 'react';
import { Tabs } from 'expo-router';
import { Map, Target, BookOpen, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { fonts } from '@/constants/theme';

function TabIcon({
  icon: Icon,
  color,
  focused,
  badge,
}: {
  icon: typeof Map;
  color: string;
  focused: boolean;
  badge?: number;
}) {
  const { colors } = useSettings();
  return (
    <View style={[styles.iconWrap, focused && { backgroundColor: colors.glassBorder }]}>
      <Icon size={22} color={color} strokeWidth={focused ? 2.6 : 2} />
      {badge ? (
        <View style={[styles.badge, { backgroundColor: colors.ember, borderColor: colors.bgRaised }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors } = useSettings();
  const { claimableQuestCount } = useUserProgress();

  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brass,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.bgRaised,
          borderTopColor: colors.surfaceBorder,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: bottomPad,
          height: 62 + bottomPad,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodyBold,
          fontSize: 11,
          marginTop: 2,
        },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: t('nav.learn'),
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Map} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: t('nav.quests'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={Target} color={color} focused={focused} badge={claimableQuestCount} />
          ),
        }}
      />
      <Tabs.Screen
        name="codex"
        options={{
          title: t('nav.codex'),
          tabBarIcon: ({ color, focused }) => <TabIcon icon={BookOpen} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="player-profile"
        options={{
          title: t('nav.profile'),
          tabBarIcon: ({ color, focused }) => <TabIcon icon={User} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 44,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontFamily: fonts.bodyBlack,
    fontSize: 10,
  },
});
