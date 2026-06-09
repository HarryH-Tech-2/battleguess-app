// This module provides translation key generation for content data.
// Content data (battles, lessons, units, etc.) uses translation keys
// that are looked up via i18next. English fallback comes from the mock data itself.

export const battleKey = (battleId: string, field: string) =>
  `content.battles.${battleId}.${field}`;

export const lessonKey = (lessonId: string, field: string) =>
  `content.lessons.${lessonId}.${field}`;

export const stepKey = (stepId: string, field: string) =>
  `content.steps.${stepId}.${field}`;

export const unitKey = (unitId: string, field: string) =>
  `content.units.${unitId}.${field}`;

export const mascotKey = (mascotId: string, field: string) =>
  `content.mascots.${mascotId}.${field}`;

export const badgeKey = (badgeId: string, field: string) =>
  `content.badges.${badgeId}.${field}`;

export const articleKey = (articleId: string, field: string) =>
  `content.articles.${articleId}.${field}`;
