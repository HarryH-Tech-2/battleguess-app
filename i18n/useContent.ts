import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { battles as rawBattles, getBattleById as rawGetBattleById } from '@/mocks/battles';
import { lessons as rawLessons, getLessonById as rawGetLessonById, getLessonsByUnitId as rawGetLessonsByUnitId } from '@/mocks/lessons';
import { units as rawUnits, getUnitsByContinent as rawGetUnitsByContinent } from '@/mocks/units';
import { mascots as rawMascots } from '@/mocks/mascots';
import { badges as rawBadges } from '@/mocks/badges';
import { educationalArticles as rawArticles } from '@/mocks/educational';
import type { Battle, Lesson, Unit, Mascot, Badge, Step } from '@/types';
import type { EducationalArticle } from '@/mocks/educational';

// Helper: try translation key, fall back to original value
function tr(t: (key: string) => string, key: string, fallback: string): string {
  const result = t(key);
  // i18next returns the key itself if no translation found
  return result === key ? fallback : result;
}

function translateBattle(t: (key: string) => string, battle: Battle): Battle {
  const k = (field: string) => `content.battles.${battle.id}.${field}`;
  return {
    ...battle,
    title: tr(t, k('title'), battle.title),
    date: tr(t, k('date'), battle.date),
    region: tr(t, k('region'), battle.region),
    conflict: tr(t, k('conflict'), battle.conflict),
    sides: {
      aName: tr(t, k('sideA'), battle.sides.aName),
      bName: tr(t, k('sideB'), battle.sides.bName),
    },
    outcome: tr(t, k('outcome'), battle.outcome),
    shortSummary: tr(t, k('shortSummary'), battle.shortSummary),
    whyItMatters: battle.whyItMatters.map((item, i) =>
      tr(t, k(`whyItMatters.${i}`), item)
    ),
    facts: battle.facts.map((fact, i) =>
      tr(t, k(`facts.${i}`), fact)
    ),
  };
}

function translateStep(t: (key: string) => string, step: Step): Step {
  const k = (field: string) => `content.steps.${step.id}.${field}`;
  const base = {
    ...step,
    prompt: tr(t, k('prompt'), step.prompt),
    feedbackCorrect: tr(t, k('feedbackCorrect'), step.feedbackCorrect),
    feedbackWrong: tr(t, k('feedbackWrong'), step.feedbackWrong),
  };

  switch (step.type) {
    case 'multiChoice':
      return {
        ...base,
        type: 'multiChoice',
        data: {
          ...step.data,
          options: step.data.options.map((opt, i) =>
            tr(t, k(`options.${i}`), opt)
          ),
        },
      };
    case 'mapTap':
      return {
        ...base,
        type: 'mapTap',
        data: {
          ...step.data,
          regions: step.data.regions.map((r) => ({
            ...r,
            name: tr(t, k(`regions.${r.id}`), r.name),
          })),
        },
      };
    case 'orderEvents':
      return {
        ...base,
        type: 'orderEvents',
        data: {
          events: step.data.events.map((e) => ({
            ...e,
            text: tr(t, k(`events.${e.id}`), e.text),
          })),
        },
      };
    case 'matchPairs':
      return {
        ...base,
        type: 'matchPairs',
        data: {
          pairs: step.data.pairs.map((p, i) => ({
            left: tr(t, k(`pairs.${i}.left`), p.left),
            right: tr(t, k(`pairs.${i}.right`), p.right),
          })),
        },
      };
    case 'fillBlank':
      return {
        ...base,
        type: 'fillBlank',
        data: {
          sentence: tr(t, k('sentence'), step.data.sentence),
          blankWord: tr(t, k('blankWord'), step.data.blankWord),
          options: step.data.options.map((opt, i) =>
            tr(t, k(`fillOptions.${i}`), opt)
          ),
        },
      };
    case 'twoTruths':
      return {
        ...base,
        type: 'twoTruths',
        data: {
          statements: step.data.statements.map((s, i) => ({
            ...s,
            text: tr(t, k(`statements.${i}`), s.text),
          })),
        },
      };
    case 'storyCard':
      return {
        ...base,
        type: 'storyCard',
        data: {
          ...step.data,
          title: tr(t, k('storyTitle'), step.data.title),
          narrative: tr(t, k('narrative'), step.data.narrative),
        },
      };
    default:
      return base as Step;
  }
}

function translateLesson(t: (key: string) => string, lesson: Lesson): Lesson {
  return {
    ...lesson,
    title: tr(t, `content.lessons.${lesson.id}.title`, lesson.title),
    steps: lesson.steps.map((step) => translateStep(t, step)),
  };
}

function translateUnit(t: (key: string) => string, unit: Unit): Unit {
  return {
    ...unit,
    title: tr(t, `content.units.${unit.id}.title`, unit.title),
    description: tr(t, `content.units.${unit.id}.description`, unit.description),
  };
}

function translateMascot(t: (key: string) => string, mascot: Mascot): Mascot {
  const k = (field: string) => `content.mascots.${mascot.id}.${field}`;
  return {
    ...mascot,
    name: tr(t, k('name'), mascot.name),
    description: tr(t, k('description'), mascot.description),
    dates: tr(t, k('dates'), mascot.dates),
    dob: tr(t, k('dob'), mascot.dob),
    dod: tr(t, k('dod'), mascot.dod),
    causeOfDeath: tr(t, k('causeOfDeath'), mascot.causeOfDeath),
  };
}

function translateBadge(t: (key: string) => string, badge: Badge): Badge {
  return {
    ...badge,
    title: tr(t, `content.badges.${badge.id}.title`, badge.title),
    description: tr(t, `content.badges.${badge.id}.description`, badge.description),
  };
}

function translateArticle(t: (key: string) => string, article: EducationalArticle): EducationalArticle {
  const k = (field: string) => `content.articles.${article.id}.${field}`;
  return {
    ...article,
    title: tr(t, k('title'), article.title),
    summary: tr(t, k('summary'), article.summary),
    content: tr(t, k('content'), article.content),
    category: tr(t, k('category'), article.category),
  };
}

export function useContent() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return useMemo(() => {
    const battles = rawBattles.map((b) => translateBattle(t, b));
    const lessons = rawLessons.map((l) => translateLesson(t, l));
    const units = rawUnits.map((u) => translateUnit(t, u));
    const mascots = rawMascots.map((m) => translateMascot(t, m));
    const badges = rawBadges.map((b) => translateBadge(t, b));
    const articles = rawArticles.map((a) => translateArticle(t, a));

    const getBattleById = (id: string) => {
      const raw = rawGetBattleById(id);
      return raw ? translateBattle(t, raw) : undefined;
    };

    const getLessonById = (id: string) => {
      const raw = rawGetLessonById(id);
      return raw ? translateLesson(t, raw) : undefined;
    };

    const getLessonsByUnitId = (unitId: string) => {
      return rawGetLessonsByUnitId(unitId).map((l) => translateLesson(t, l));
    };

    const getUnitsByContinent = (continent: string) => {
      return rawGetUnitsByContinent(continent).map((u) => translateUnit(t, u));
    };

    return {
      battles,
      lessons,
      units,
      mascots,
      badges,
      articles,
      getBattleById,
      getLessonById,
      getLessonsByUnitId,
      getUnitsByContinent,
    };
  }, [t, lang]);
}
