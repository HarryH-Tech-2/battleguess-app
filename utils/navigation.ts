import { router, type Href } from 'expo-router';

/**
 * Go back if there is history, otherwise replace with a sensible screen.
 * Screens can be opened directly (deep link, web URL, cold start) with no
 * history, in which case `router.back()` would silently do nothing.
 */
export function goBack(fallback: Href = '/(tabs)/(home)/learn') {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}
