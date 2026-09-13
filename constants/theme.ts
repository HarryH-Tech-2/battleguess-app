/**
 * BattleGuess design tokens — "the war room at night".
 *
 * Dark is the primary theme: ink-navy ground lit by brass, with parchment as the
 * surface you read on. Light is the "day map": parchment ground with ink text.
 */

export const palette = {
  ink: '#0F1420',
  ink2: '#1A2233',
  ink3: '#26324A',
  ink4: '#34425E',
  inkDeep: '#0A0E17',

  parchment: '#F4E8CF',
  parchment2: '#E7D6B0',
  parchment3: '#CDB98C',
  parchmentInk: '#2B2419',
  parchmentInkSoft: '#6B5F4E',

  brass: '#D9A441',
  brassLight: '#F2C76B',
  brassDark: '#A9782A',

  ember: '#F2622D',
  emberDark: '#C24717',
  emberLight: '#FF8A5C',

  laurel: '#3FA35B',
  laurelDark: '#2B7A42',
  laurelLight: '#DDF3E3',

  crimson: '#D7383E',
  crimsonDark: '#A2262B',
  crimsonLight: '#FBE0E1',

  steel: '#97A3B6',
  steelDark: '#5C6B82',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export const fonts = {
  display: 'Cinzel_700Bold',
  displayBlack: 'Cinzel_900Black',
  body: 'Nunito_400Regular',
  bodySemi: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
  bodyBlack: 'Nunito_800ExtraBold',
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export interface ThemeColors {
  // Ground
  bg: string;
  bgRaised: string;
  bgSunken: string;
  surface: string;
  surfaceBorder: string;
  surfaceStrong: string;
  glass: string;
  glassBorder: string;

  // Type
  text: string;
  textSecondary: string;
  textMuted: string;
  textOnAccent: string;
  textOnParchment: string;
  textOnParchmentSoft: string;

  // Accents
  brass: string;
  brassLight: string;
  brassDark: string;
  ember: string;
  emberDark: string;
  success: string;
  successDark: string;
  successSoft: string;
  error: string;
  errorDark: string;
  errorSoft: string;
  hearts: string;
  streak: string;
  xp: string;

  // Choice cards (lesson options)
  option: string;
  optionEdge: string;
  optionText: string;
  optionSelected: string;
  optionSelectedEdge: string;

  // Path
  pathLocked: string;
  pathLockedEdge: string;
  pathLine: string;

  // Legacy keys (kept so older screens keep compiling)
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  backgroundDark: string;
  card: string;
  cardBorder: string;
  textLight: string;
  textInverse: string;
  successLight: string;
  errorLight: string;
  warning: string;
}

export const darkTheme: ThemeColors = {
  bg: palette.ink,
  bgRaised: palette.ink2,
  bgSunken: palette.inkDeep,
  surface: palette.ink2,
  surfaceBorder: palette.ink3,
  surfaceStrong: palette.ink3,
  glass: 'rgba(15, 20, 32, 0.72)',
  glassBorder: 'rgba(217, 164, 65, 0.22)',

  text: palette.parchment,
  textSecondary: palette.steel,
  textMuted: palette.steelDark,
  textOnAccent: palette.white,
  textOnParchment: palette.parchmentInk,
  textOnParchmentSoft: palette.parchmentInkSoft,

  brass: palette.brass,
  brassLight: palette.brassLight,
  brassDark: palette.brassDark,
  ember: palette.ember,
  emberDark: palette.emberDark,
  success: palette.laurel,
  successDark: palette.laurelDark,
  successSoft: 'rgba(63, 163, 91, 0.18)',
  error: palette.crimson,
  errorDark: palette.crimsonDark,
  errorSoft: 'rgba(215, 56, 62, 0.18)',
  hearts: palette.crimson,
  streak: palette.ember,
  xp: palette.brass,

  option: palette.parchment,
  optionEdge: palette.parchment3,
  optionText: palette.parchmentInk,
  optionSelected: '#FFF3D6',
  optionSelectedEdge: palette.brass,

  pathLocked: palette.ink3,
  pathLockedEdge: palette.ink4,
  pathLine: 'rgba(217, 164, 65, 0.28)',

  primary: palette.ember,
  primaryLight: palette.emberLight,
  primaryDark: palette.emberDark,
  background: palette.ink,
  backgroundDark: palette.ink2,
  card: palette.ink2,
  cardBorder: palette.ink3,
  textLight: palette.steelDark,
  textInverse: palette.white,
  successLight: 'rgba(63, 163, 91, 0.18)',
  errorLight: 'rgba(215, 56, 62, 0.18)',
  warning: palette.brass,
};

export const lightTheme: ThemeColors = {
  bg: palette.parchment,
  bgRaised: '#FBF4E4',
  bgSunken: palette.parchment2,
  surface: '#FFFAF0',
  surfaceBorder: palette.parchment3,
  surfaceStrong: palette.parchment2,
  glass: 'rgba(244, 232, 207, 0.82)',
  glassBorder: 'rgba(169, 120, 42, 0.25)',

  text: palette.parchmentInk,
  textSecondary: palette.parchmentInkSoft,
  textMuted: '#9A8C74',
  textOnAccent: palette.white,
  textOnParchment: palette.parchmentInk,
  textOnParchmentSoft: palette.parchmentInkSoft,

  brass: palette.brassDark,
  brassLight: palette.brass,
  brassDark: '#7E5A1F',
  ember: palette.ember,
  emberDark: palette.emberDark,
  success: palette.laurel,
  successDark: palette.laurelDark,
  successSoft: palette.laurelLight,
  error: palette.crimson,
  errorDark: palette.crimsonDark,
  errorSoft: palette.crimsonLight,
  hearts: palette.crimson,
  streak: palette.ember,
  xp: palette.brassDark,

  option: '#FFFAF0',
  optionEdge: palette.parchment3,
  optionText: palette.parchmentInk,
  optionSelected: '#FFF3D6',
  optionSelectedEdge: palette.brass,

  pathLocked: palette.parchment2,
  pathLockedEdge: palette.parchment3,
  pathLine: 'rgba(169, 120, 42, 0.35)',

  primary: palette.ember,
  primaryLight: palette.emberLight,
  primaryDark: palette.emberDark,
  background: palette.parchment,
  backgroundDark: palette.parchment2,
  card: '#FFFAF0',
  cardBorder: palette.parchment3,
  textLight: '#9A8C74',
  textInverse: palette.white,
  successLight: palette.laurelLight,
  errorLight: palette.crimsonLight,
  warning: palette.brassDark,
};

export type ColorScheme = ThemeColors;
