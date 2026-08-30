import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ProductCard } from '@/components/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PRODUCTS } from '@/constants/products';
import { useCart } from '@/context/cart-context';

export default function HomeScreen() {
  const { items } = useCart();
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#DDF3F5', dark: '#0B2E4F' }}
      headerImage={
        <Image
          source={require('@/assets/images/logo.jpg')}
          style={styles.reactLogo}
          contentFit="contain"
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Mountain Park Spring Water</ThemedText>
      </ThemedView>

      <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/modal')}>
        <Text style={styles.cartButtonText}>View Cart ({items.length})</Text>
      </TouchableOpacity>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  reactLogo: {
    height: 250,
    width: 250,
    alignSelf: 'center',
  },
  cartButton: {
    backgroundColor: '#1595B3',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  cartButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});