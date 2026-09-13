import type { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * App variant, driven by APP_VARIANT (set per EAS build profile in eas.json).
 *
 *   development -> "BattleGuess Dev", package/bundle id suffixed with ".dev"
 *   preview     -> "BattleGuess Beta", suffixed with ".preview"
 *   production  -> "BattleGuess", canonical ids (default)
 *
 * Each variant has its own application id so they can be installed on the
 * same device side by side.
 */
type Variant = 'development' | 'preview' | 'production';

const VARIANT: Variant = (() => {
  const v = process.env.APP_VARIANT;
  return v === 'development' || v === 'preview' ? v : 'production';
})();

const BASE_ANDROID_PACKAGE = 'app.rork.battleguess.quiz';
const BASE_IOS_BUNDLE_ID = 'app.rork.battleguess-history-quiz';

const VARIANT_CONFIG: Record<Variant, { name: string; idSuffix: string; scheme: string }> = {
  development: { name: 'BattleGuess Dev', idSuffix: '.dev', scheme: 'rork-app-dev' },
  preview: { name: 'BattleGuess Beta', idSuffix: '.preview', scheme: 'rork-app-preview' },
  production: { name: 'BattleGuess', idSuffix: '', scheme: 'rork-app' },
};

const { name, idSuffix, scheme } = VARIANT_CONFIG[VARIANT];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name,
  slug: 'battleguess',
  version: '1.0.0',
  orientation: 'default',
  icon: './assets/images/icon.png',
  scheme,
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#111A24',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: `${BASE_IOS_BUNDLE_ID}${idSuffix}`,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#111A24',
    },
    package: `${BASE_ANDROID_PACKAGE}${idSuffix}`,
    permissions: ['android.permission.VIBRATE'],
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    [
      'expo-router',
      {
        origin: 'https://rork.com/',
      },
    ],
    'expo-font',
    'expo-web-browser',
    'expo-localization',
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: 'https://rork.com/',
    },
    eas: {
      projectId: 'ffe5f6cf-d58f-437f-be85-718ec553dcf8',
    },
    appVariant: VARIANT,
  },
  owner: 'harryhh',
});
