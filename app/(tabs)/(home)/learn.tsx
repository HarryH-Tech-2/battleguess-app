import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
  LayoutChangeEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Flame, Star, Heart } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { getBattleImage, getEmblemImage, getMascotImage } from '@/mocks/images';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { StatChip } from '@/components/ui/StatChip';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { PathNode, NodeState } from '@/components/learn/PathNode';
import { ChapterBanner } from '@/components/learn/ChapterBanner';
import { fonts, radius } from '@/constants/theme';
import type { Lesson, Unit } from '@/types';
import { tap } from '@/utils/haptics';

const CONTINENTS = ['all', 'europe', 'asia', 'africa', 'americas'] as const;
const CONTINENT_ORDER: Record<string, number> = { europe: 0, asia: 1, africa: 2, americas: 3 };

const TRUNK = 88;
const SIDE = 70;
const ROW_TRUNK = 150;
const ROW_SIDE = 128;
const SWING = 92;
/** Horizontal offsets that make the path wind: centre, right, left, centre... */
const SWING_PATTERN = [0, 1, -1, 0, -1, 1];

interface NodeSpec {
  lesson: Lesson;
  state: NodeState;
  isTrunk: boolean;
  x: number;
  y: number;
  size: number;
}

export default function LearnScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { progress, isLessonCompleted, getLessonMastery, getDailyGoalProgress } = useUserProgress();
  const { colors, fontScale, haptics } = useSettings();
  const { units, getLessonsByUnitId } = useContent();
  const [continent, setContinent] = useState<(typeof CONTINENTS)[number]>('all');
  const scrollRef = useRef<ScrollView>(null);
  const chapterYs = useRef<Record<string, number>>({});
  const scrolledOnce = useRef(false);

  const mascotImage = getMascotImage(progress.selectedMascotId);
  const dailyGoal = getDailyGoalProgress();

  const chapters = useMemo(() => {
    const list = continent === 'all' ? units : units.filter((u) => u.continent === continent);
    return [...list].sort(
      (a, b) =>
        (CONTINENT_ORDER[a.continent] ?? 9) - (CONTINENT_ORDER[b.continent] ?? 9) || a.orderIndex - b.orderIndex
    );
  }, [units, continent]);

  /** Chapter unlock is judged within its own continent so every view agrees. */
  const isChapterUnlocked = useCallback(
    (unit: Unit) => {
      const siblings = units
        .filter((u) => u.continent === unit.continent)
        .sort((a, b) => a.orderIndex - b.orderIndex);
      const idx = siblings.findIndex((u) => u.id === unit.id);
      if (idx <= 0) return true;
      const prevTrunk = getLessonsByUnitId(siblings[idx - 1].id)[0];
      return prevTrunk ? isLessonCompleted(prevTrunk.id) : true;
    },
    [units, getLessonsByUnitId, isLessonCompleted]
  );

  const layout = useMemo(() => {
    const centre = width / 2;
    let currentFound = false;
    return chapters.map((unit, chapterIndex) => {
      const lessons = getLessonsByUnitId(unit.id);
      const unlocked = isChapterUnlocked(unit);
      const trunkDone = lessons[0] ? isLessonCompleted(lessons[0].id) : false;
      const completed = lessons.filter((l) => isLessonCompleted(l.id)).length;
      let y = 0;
      const nodes: NodeSpec[] = lessons.map((lesson, i) => {
        const isTrunk = i === 0;
        const done = isLessonCompleted(lesson.id);
        const open = isTrunk ? unlocked : unlocked && trunkDone;
        let state: NodeState = !open ? 'locked' : done ? 'complete' : 'available';
        if (state === 'available' && !currentFound) {
          state = 'current';
          currentFound = true;
        }
        const size = isTrunk ? TRUNK : SIDE;
        const swing = SWING_PATTERN[(chapterIndex + i) % SWING_PATTERN.length] * SWING;
        const spec: NodeSpec = { lesson, state, isTrunk, x: centre + swing, y: y + size / 2 + 8, size };
        y += isTrunk ? ROW_TRUNK : ROW_SIDE;
        return spec;
      });
      return { unit, lessons, unlocked, completed, nodes, height: y + 8 };
    });
  }, [chapters, getLessonsByUnitId, isChapterUnlocked, isLessonCompleted, width]);

  const currentChapterId = useMemo(
    () => layout.find((c) => c.nodes.some((n) => n.state === 'current'))?.unit.id,
    [layout]
  );

  const onChapterLayout = (id: string) => (e: LayoutChangeEvent) => {
    chapterYs.current[id] = e.nativeEvent.layout.y;
    if (!scrolledOnce.current && id === currentChapterId && chapterYs.current[id] > 200) {
      scrolledOnce.current = true;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: chapterYs.current[id] - 12, animated: true });
      }, 350);
    }
  };

  useEffect(() => {
    scrolledOnce.current = false;
  }, [continent]);

  const openLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const pathFor = (nodes: NodeSpec[]) => {
    if (nodes.length < 2) return '';
    let d = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 1; i < nodes.length; i++) {
      const a = nodes[i - 1];
      const b = nodes[i];
      const midY = (a.y + b.y) / 2;
      d += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
    }
    return d;
  };

  return (
    <ScreenBackground>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8, backgroundColor: colors.glass, borderBottomColor: colors.glassBorder }]}>
        <View style={styles.statsRow}>
          <StatChip
            icon={<Flame size={18} color={colors.streak} fill={progress.currentStreak > 0 ? colors.streak : 'transparent'} />}
            value={progress.currentStreak}
            color={progress.currentStreak > 0 ? colors.streak : colors.textMuted}
            onPress={() => router.push('/(tabs)/quests')}
            accessibilityLabel={t('profile.dayStreak')}
          />
          <StatChip
            icon={<Star size={18} color={colors.xp} fill={colors.xp} />}
            value={progress.totalXp.toLocaleString()}
            color={colors.xp}
            onPress={() => router.push('/(tabs)/player-profile')}
            accessibilityLabel={t('profile.totalXp')}
          />
          <StatChip
            icon={<Heart size={18} color={colors.hearts} fill={colors.hearts} />}
            value={progress.hearts}
            color={colors.hearts}
            accessibilityLabel={t('profile.hearts')}
          />
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={() => router.push('/(tabs)/player-profile')}
            accessibilityRole="button"
            accessibilityLabel={t('nav.profile')}
            style={styles.avatarWrap}
          >
            <ProgressRing size={46} strokeWidth={3} value={dailyGoal} color={dailyGoal >= 1 ? colors.success : colors.brass} track={colors.surfaceBorder} />
            <View style={[styles.avatar, { borderColor: colors.bg }]}>
              {mascotImage ? <Image source={mascotImage} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
            </View>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {CONTINENTS.map((c) => {
            const active = c === continent;
            return (
              <Pressable
                key={c}
                onPress={() => {
                  if (haptics) tap();
                  setContinent(c);
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.brass : 'transparent',
                    borderColor: active ? colors.brass : colors.surfaceBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? '#2B2419' : colors.textSecondary, fontSize: 13 * fontScale },
                  ]}
                >
                  {t(`learn.${c === 'all' ? 'allContinents' : c}`)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, { paddingBottom: 60 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {layout.map((chapter, chapterIndex) => {
          const trunkBattleId = chapter.lessons[0]?.battleId;
          return (
            <View key={chapter.unit.id} onLayout={onChapterLayout(chapter.unit.id)} style={styles.chapter}>
              <View style={styles.bannerWrap}>
                <ChapterBanner
                  index={chapterIndex}
                  chapterLabel={t('learn.chapter', { n: chapter.unit.orderIndex + 1 })}
                  title={chapter.unit.title}
                  description={chapter.unit.description}
                  image={trunkBattleId ? getBattleImage(trunkBattleId) : undefined}
                  emblem={getEmblemImage(chapter.unit.id)}
                  completed={chapter.completed}
                  total={chapter.lessons.length}
                  progressLabel={t('learn.battlesDone', { completed: chapter.completed, total: chapter.lessons.length })}
                  locked={!chapter.unlocked}
                  lockedHint={t('learn.lockedHint')}
                />
              </View>

              <View style={{ height: chapter.height }}>
                <Svg width={width} height={chapter.height} style={StyleSheet.absoluteFill} pointerEvents="none">
                  <Path
                    d={pathFor(chapter.nodes)}
                    stroke={colors.pathLine}
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray="1 18"
                    fill="none"
                  />
                </Svg>
                {chapter.nodes.map((n) => {
                  const wrapWidth = n.size + 60;
                  return (
                    <View
                      key={n.lesson.id}
                      style={{ position: 'absolute', left: n.x - wrapWidth / 2, top: n.y - n.size / 2, width: wrapWidth }}
                    >
                      <PathNode
                        image={getBattleImage(n.lesson.battleId)}
                        state={n.state}
                        size={n.size}
                        mastery={getLessonMastery(n.lesson.id)}
                        label={n.lesson.title}
                        sublabel={n.isTrunk ? t('learn.mainBattle') : t('learn.minutes', { count: n.lesson.estimatedMinutes })}
                        tooltip={chapter.completed > 0 ? t('learn.continue') : t('learn.start')}
                        onPress={() => openLesson(n.lesson.id)}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    gap: 10,
    zIndex: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    backgroundColor: '#26324A',
  },
  chipsRow: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 14,
    height: 32,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontFamily: fonts.bodyBlack,
    letterSpacing: 0.2,
  },
  content: {
    paddingTop: 16,
  },
  chapter: {
    marginBottom: 8,
  },
  bannerWrap: {
    paddingHorizontal: 16,
    marginBottom: 18,
  },
});
