import React, { useEffect, useRef } from 'react';
import { Animated, Modal as RNModal, Pressable, StyleSheet, View, Text } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts, radius } from '@/constants/theme';

interface Props {
  visible: boolean;
  title: string;
  body?: string;
  children?: React.ReactNode;
  onDismiss?: () => void;
}

/** Parchment dialog card that pops in over a dimmed ground. */
export function Dialog({ visible, title, body, children, onDismiss }: Props) {
  const { colors, reducedMotion, fontScale } = useSettings();
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      pop.setValue(0);
      return;
    }
    if (reducedMotion) {
      pop.setValue(1);
      return;
    }
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 8 }).start();
  }, [visible, pop, reducedMotion]);

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.option,
              borderColor: colors.optionEdge,
              opacity: pop,
              transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
            },
          ]}
        >
          <Pressable onPress={() => {}} style={styles.inner}>
            <Text style={[styles.title, { color: colors.textOnParchment, fontSize: 22 * fontScale }]}>{title}</Text>
            {body ? (
              <Text style={[styles.body, { color: colors.textOnParchmentSoft, fontSize: 15 * fontScale }]}>{body}</Text>
            ) : null}
            <View style={styles.actions}>{children}</View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10,14,23,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: radius.lg,
    borderWidth: 2,
  },
  inner: {
    padding: 22,
    gap: 10,
  },
  title: {
    fontFamily: fonts.display,
    textAlign: 'center',
  },
  body: {
    fontFamily: fonts.bodySemi,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    marginTop: 10,
    gap: 10,
  },
});
