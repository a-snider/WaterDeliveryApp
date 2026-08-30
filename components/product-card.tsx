import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Product } from '@/constants/products';
import { useCart } from '@/context/cart-context';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <View style={styles.card}>
      <Image source={product.image} style={styles.image} contentFit="contain" />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.button} onPress={() => addToCart(product)}>
        <Text style={styles.buttonText}>Add to Order</Text>
      </TouchableOpacity>
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