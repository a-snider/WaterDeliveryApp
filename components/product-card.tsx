import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Product } from '@/app/(tabs)/index';
import { AnimatedButton } from '@/components/animated-button';
import { useToast } from '@/components/toast';
import { useCart } from '@/context/cart-context';

const FREQUENCIES = [
  { label: 'One-time', weeks: null },
  { label: 'Every 1 wk', weeks: 1 },
  { label: 'Every 2 wks', weeks: 2 },
  { label: 'Every 4 wks', weeks: 4 },
];

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [frequencyWeeks, setFrequencyWeeks] = useState<number | null>(null);

  const handleAdd = () => {
    addToCart(product, quantity, frequencyWeeks !== null, frequencyWeeks);
    const freqLabel = FREQUENCIES.find((f) => f.weeks === frequencyWeeks)?.label;
    showToast(`${quantity}x ${product.name} added (${freqLabel})`);
  };

  return (
    <View style={styles.card}>
      <Image
        source={product.imageUrl ? { uri: product.imageUrl } : require('@/assets/images/logo.jpg')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>

      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
          <Text style={styles.stepperText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity style={styles.stepperButton} onPress={() => setQuantity((q) => q + 1)}>
          <Text style={styles.stepperText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.freqRow}>
        {FREQUENCIES.map((f) => (
          <TouchableOpacity
            key={f.label}
            style={[styles.freqChip, frequencyWeeks === f.weeks && styles.freqChipActive]}
            onPress={() => setFrequencyWeeks(f.weeks)}>
            <Text
              style={[styles.freqChipText, frequencyWeeks === f.weeks && styles.freqChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <AnimatedButton style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add to Order</Text>
      </AnimatedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#F2F8F9',
    borderRadius: 12,
    padding: 12,
    margin: 6,
    alignItems: 'center',
  },
  image: {
    height: 80,
    width: 80,
    marginBottom: 8,
  },
  name: {
    color: '#1A1A1A',
    fontWeight: '600',
    textAlign: 'center',
  },
  price: {
    color: '#1A1A1A',
    marginTop: 2,
    marginBottom: 8,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#0B2E4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    minWidth: 18,
    textAlign: 'center',
  },
  freqRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 10,
  },
  freqChip: {
    borderWidth: 1,
    borderColor: '#1595B3',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  freqChipActive: {
    backgroundColor: '#1595B3',
  },
  freqChipText: {
    fontSize: 10,
    color: '#1595B3',
    fontWeight: '600',
  },
  freqChipTextActive: {
    color: '#FFF',
  },
  button: {
    backgroundColor: '#1595B3',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
});