import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ProductCard } from '@/components/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCart } from '@/context/cart-context';
import { db } from '@/firebase/config';

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
};

export default function HomeScreen() {
  const { items, totalItems } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts().then(() => setLoading(false));
  }, [fetchProducts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  return (
   <ParallaxScrollView
  headerBackgroundColor={{ light: '#DDF3F5', dark: '#0B2E4F' }}
  refreshing={refreshing}
  onRefresh={onRefresh}
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
        <Text style={styles.cartButtonText}>View Cart ({totalItems})</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#1595B3" style={{ marginTop: 40 }} />
      ) : products.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>
          No products available right now.
        </Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}
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