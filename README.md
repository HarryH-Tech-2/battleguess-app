# BattleGuess

Learn the battles that shaped the world, five minutes at a time. BattleGuess is a
Duolingo-style mobile app for military history: a campaign map of chapters, short
lessons made of quiz steps, daily quests, ranks, and a Codex of every battle you
have studied.

Built with Expo Router and React Native. Runs on iOS, Android and the web.

## Features

- **Campaign map** of 23 chapters grouped by continent, unlocked as you progress.
- **Lesson steps**: multiple choice, fill the blank, two truths and a lie, timeline
  slider, map tap (pins placed by real latitude and longitude), order the events,
  match pairs, and a story card that closes each lesson.
- **Hearts, combos and XP** with perfect and combo bonuses.
- **Daily quests** picked deterministically per day, with XP and heart rewards.
- **Ranks** from Recruit upward, shown on the profile and after each lesson.
- **Codex** of 67 battles with painted artwork and a detail page per battle.
- **Four commander guides** who react to your answers.
- **Themes**: night (default) and day, with reduced motion and larger text options.
- **Languages**: English, Spanish, French, Japanese, Arabic.

## Getting started

```bash
npm install
npx expo start            # native (Expo Go or a dev build)
npx expo start --web      # web
```

Checks:

```bash
npx tsc --noEmit -p tsconfig.json
npx expo lint
```

## Project layout

| Path | What lives there |
| --- | --- |
| `app/` | Expo Router screens. Tabs are Learn, Quests, Codex, Profile. |
| `components/ui` | Shared UI kit (buttons, progress, dialogs, backgrounds). |
| `components/learn`, `components/lesson` | Campaign-map and lesson-step components. |
| `constants/theme.ts` | Colour tokens, fonts (Cinzel + Nunito), radii. |
| `contexts/` | Settings and user progress state (persisted with AsyncStorage). |
| `mocks/` | Battle, lesson, badge and image data. |
| `i18n/` | Locale files and content translation hooks. |
| `utils/` | Ranks, quests, haptics. |
| `scripts/art/` | Prompt building, image download/resize and icon generation for the art pipeline. |
| `docs/superpowers/` | Design specs and session handoffs. |

## Build variants

`app.config.ts` reads `APP_VARIANT` (`development`, `preview`, `production`) so each
EAS build profile gets its own app name, bundle id and URL scheme.

## Art

Battle scenes, chapter emblems, commander portraits and the app icon were generated
with Higgsfield `z_image` in a painterly matte-painting style and downscaled to JPEG.
Prompts and result URLs are in `scripts/art/`.
