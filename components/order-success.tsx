import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { AnimatedButton } from '@/components/animated-button';

export function OrderSuccess({ onDone }: { onDone: () => void }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Animated.View style={[styles.checkCircle, { transform: [{ scale }] }]}>
        <Text style={styles.checkmark}>✓</Text>
      </Animated.View>
      <Text style={styles.title}>Order Placed!</Text>
      <Text style={styles.subtitle}>We'll have your water on the way soon.</Text>
      <AnimatedButton style={styles.button} onPress={onDone}>
        <Text style={styles.buttonText}>Done</Text>
      </AnimatedButton>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  checkCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2E8B57',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 46,
    color: '#FFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1595B3',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#0B2E4F',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});