import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type Props = {
  createdAt: Date;
  deliveryDate: Date;
};

export function DeliveryProgress({ createdAt, deliveryDate }: Props) {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -4, duration: 400, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const now = new Date();
  const totalMs = deliveryDate.getTime() - createdAt.getTime();
  const elapsedMs = now.getTime() - createdAt.getTime();
  const rawProgress = totalMs > 0 ? elapsedMs / totalMs : 1;
  const progress = Math.min(1, Math.max(0, rawProgress));

  const daysLeft = Math.max(
    0,
    Math.ceil((deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );
 
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        <Animated.Text
  style={[
    styles.truck,
    {
      left: `${progress * 100}%`,
      transform: [{ translateY: bounce }, { translateX: -12 }, { scaleX: -1 }],
    },
  ]}>
  🚚
</Animated.Text>
      </View>
      <Text style={styles.label}>
        {daysLeft === 0 ? 'Arriving today!' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} until delivery`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  track: {
    height: 6,
    backgroundColor: '#DDE7EA',
    borderRadius: 3,
    marginTop: 14,
    position: 'relative',
  },
  fill: {
    height: 6,
    backgroundColor: '#1595B3',
    borderRadius: 3,
  },
  truck: {
  position: 'absolute',
  top: -14,
  fontSize: 20,
  transform: [{ scaleX: -1 }],
},
  label: {
    fontSize: 12,
    color: '#555',
    marginTop: 6,
    textAlign: 'right',
  },
});