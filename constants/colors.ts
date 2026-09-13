// Backwards-compatible re-export. New code should import from '@/constants/theme'.
import { darkTheme, lightTheme } from './theme';
export type { ColorScheme } from './theme';

export const lightColors = lightTheme;
export const darkColors = darkTheme;

export default lightColors;
