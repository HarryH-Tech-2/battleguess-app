# BattleGuess "Campaign" overhaul — design spec

Date: 2026-09-12
Status: implemented in this session (autonomous run; decisions below were made without a
design conversation, so treat every section as open to revision).

## Brief

Turn BattleGuess into "Duolingo for military history": a daily-habit learning app with a
winding lesson path, streaks, hearts, XP, quests and collectibles, wrapped in a distinctive
visual identity with painted backdrops and lively motion. Regenerate all artwork.

## Art direction: "the war room at night"

The app is a campaign map spread on a commander's table. Everything sits on deep ink-navy,
lit by brass. Painted battle scenes are the backdrops; parchment is the surface you read on.

### Palette (dark, primary)

| Token      | Hex       | Role                                           |
|------------|-----------|------------------------------------------------|
| ink        | `#0F1420` | background                                     |
| ink2       | `#1A2233` | raised surfaces, tab bar                       |
| parchment  | `#F4E8CF` | cards, option buttons, text on dark            |
| brass      | `#D9A441` | XP, rings, headings, active state              |
| ember      | `#F2622D` | primary CTA, streak (carries the old brand orange) |
| laurel     | `#3FA35B` | success                                        |
| crimson    | `#D7383E` | error, hearts                                  |
| steel      | `#97A3B6` | secondary text on dark                         |

Light theme is the "day map": parchment ground (`#F4E8CF`), ink text, same accents.

### Typography

- Cinzel (600/700/900) — display: screen titles, chapter names, big numbers, rank names.
- Nunito (400/600/700/800) — everything else. Rounded and friendly, in the Duolingo spirit.

### Imagery (Higgsfield z_image, 0.15 credits each)

- 67 battle scenes, 16:9, painterly cinematic matte-painting style, saved as 1280×720 JPEG.
- 23 chapter emblems, 1:1, brass/steel object on navy, 512 px.
- 4 commander mascots, 1:1, stylized friendly bust portraits, 768 px.
- 1 onboarding hero, 9:16. App icon + splash regenerated from the shield motif.

## Screens

### Tabs: Learn · Quests · Codex · Profile (Settings via gear on Profile)

### Learn ("Campaign")
- Sticky glass stats bar: streak, XP, hearts, avatar.
- Continent chips (All / Europe / Asia / Africa / Americas).
- Each unit is a chapter: a full-bleed painted banner (its first battle's image), title,
  description, progress, then its lessons as winding path nodes over faint topographic lines.
- Nodes are 84 px coins holding the battle image inside a brass ring with a chunky 3D edge.
  States: locked (desaturated + lock), available (glow pulse), current (bouncing START
  tooltip), complete (brass check + mastery crowns).
- Unlock rule unchanged: chapter N+1 opens after chapter N's first lesson is completed.

### Lesson
- Hero strip: battle image with gradient and title/date, on every step.
- Question card on parchment, chunky 3D options, brass selection, laurel/crimson results.
- Combo chip after 2+ consecutive correct answers (bonus XP at end).
- Feedback sheet slides up from the bottom with the mascot and explanation.
- 3 hearts per lesson (unchanged).

### Lesson complete
- Confetti burst, "Victory" in Cinzel, battle card reveal ("added to your Codex"),
  count-up XP with combo bonus, accuracy, streak, and rank progress bar.

### Quests (new)
- Three daily quests seeded by date: XP, lessons, correct answers, perfect lesson,
  new battle. Claiming rewards XP or a heart. Counters reset daily in progress state.

### Codex (new)
- Grid of battle cards; unlocked when the battle's lesson is completed. Tap for a detail
  screen (`/battle/[id]`) with summary, sides, commanders, why it matters, facts.

### Profile
- Painted banner with mascot, rank title + progress to next rank, stats, streak calendar,
  badges, question history. Gear opens Settings.

### Ranks (XP thresholds)
Recruit 0 · Private 50 · Corporal 150 · Sergeant 300 · Lieutenant 500 · Captain 800 ·
Major 1200 · Colonel 1800 · General 2600 · Field Marshal 3600.

## Code structure

- `constants/theme.ts` — tokens (colors, fonts, radii, spacing) + `useTheme()`.
- `components/ui/*` — ScreenBackground, ChunkyButton, StatChip, ProgressRing, Confetti,
  Topography, GlassBar.
- `components/learn/*` — ChapterBanner, PathNode.
- `mocks/images.ts` — single source for battle / emblem / mascot image requires.
- `utils/ranks.ts`, `utils/quests.ts` — pure functions, unit-testable.
- `contexts/UserProgressContext.tsx` — adds daily counters, quest claims, combo bonus.

## Out of scope

Backend, accounts, leaderboards, notifications, paid hearts.
