import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { OrderCard } from '@/components/order-card';
import { useAuth } from '@/context/auth-context';
import { db } from '@/firebase/config';

export type FirestoreOrder = {
  id: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  status: string;
  createdAt: any;
};

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FirestoreOrder[];
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Orders</Text>
        <Text style={styles.empty}>Log in to see your orders.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1595B3" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.empty}>You haven&apos;t placed any orders yet.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1595B3',
    marginBottom: 20,
  },
  empty: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    paddingBottom: 20,
  },
});