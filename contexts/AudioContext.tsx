import { Audio } from 'expo-av';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from './SettingsContext';

// Militaristic but calming background music URL (royalty-free)
const BACKGROUND_MUSIC_URL = 'https://assets.mixkit.co/music/preview/mixkit-epic-orchestra-transition-2290.mp3';

export const [AudioProvider, useAudio] = createContextHook(() => {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Configure audio mode
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    return () => {
      // Cleanup on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadMusic = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: BACKGROUND_MUSIC_URL },
        {
          isLooping: true,
          volume: 0.3,
          shouldPlay: false,
        }
      );
      soundRef.current = sound;
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load background music:', error);
    }
  }, []);

  const playMusic = useCallback(async () => {
    if (!settings.soundEnabled) return;

    if (!isLoaded) {
      await loadMusic();
    }

    if (soundRef.current) {
      try {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to play music:', error);
      }
    }
  }, [settings.soundEnabled, isLoaded, loadMusic]);

  const pauseMusic = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } catch (error) {
        console.error('Failed to pause music:', error);
      }
    }
  }, []);

  const stopMusic = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        setIsPlaying(false);
      } catch (error) {
        console.error('Failed to stop music:', error);
      }
    }
  }, []);

  const setVolume = useCallback(async (volume: number) => {
    if (soundRef.current) {
      try {
        await soundRef.current.setVolumeAsync(Math.max(0, Math.min(1, volume)));
      } catch (error) {
        console.error('Failed to set volume:', error);
      }
    }
  }, []);

  // Stop music when sound is disabled
  useEffect(() => {
    if (!settings.soundEnabled && isPlaying) {
      pauseMusic();
    }
  }, [settings.soundEnabled, isPlaying, pauseMusic]);

  return {
    isPlaying,
    isLoaded,
    playMusic,
    pauseMusic,
    stopMusic,
    setVolume,
    loadMusic,
  };
});
