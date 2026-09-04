import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { db } from '@/firebase/config';

type DispatchOrder = {
  id: string;
  userEmail: string;
  items: { name: string; quantity: number; recurring?: boolean; frequencyWeeks?: number | null }[];
  total: number;
  status: string;
  approved?: boolean;
  deliveryInstructions?: string;
  createdAt: any;
};

const STATUS_FLOW = ['Scheduled', 'Out for Delivery', 'Delivered'];

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#2E8B57',
  'Out for Delivery': '#D98E04',
  Scheduled: '#1595B3',
};

export default function DispatchScreen() {
  const [orders, setOrders] = useState<DispatchOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as DispatchOrder[];
      setOrders(data);
    } catch (error) {
      console.error('Error fetching all orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders().then(() => setLoading(false));
  }, [fetchOrders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  const toggleApproved = async (order: DispatchOrder) => {
    await updateDoc(doc(db, 'orders', order.id), { approved: !order.approved });
    fetchOrders();
  };

  const advanceStatus = async (order: DispatchOrder) => {
    const currentIndex = STATUS_FLOW.indexOf(order.status);
    const nextStatus = STATUS_FLOW[currentIndex + 1];
    if (!nextStatus) return;
    await updateDoc(doc(db, 'orders', order.id), { status: nextStatus });
    fetchOrders();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1595B3" style={{ marginTop: 60 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispatch</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1595B3']} />
        }
        renderItem={({ item }) => {
          const dateLabel = item.createdAt?.toDate
            ? item.createdAt.toDate().toLocaleDateString()
            : 'Pending';
          const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(item.status) + 1];

          return (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.email}>{item.userEmail}</Text>
                <View
                  style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] || '#999' }]}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.date}>{dateLabel}</Text>

              {item.items.map((product, index) => (
                <Text key={index} style={styles.itemText}>
                  {product.quantity}x {product.name}
                  {product.recurring ? ` (repeats every ${product.frequencyWeeks} wk)` : ''}
                </Text>
              ))}

              {item.deliveryInstructions ? (
                <Text style={styles.instructions}>Note: {item.deliveryInstructions}</Text>
              ) : null}

              <Text style={styles.total}>${item.total.toFixed(2)}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionButton, item.approved && styles.actionButtonActive]}
                  onPress={() => toggleApproved(item)}>
                  <Text
                    style={[
                      styles.actionButtonText,
                      item.approved && styles.actionButtonTextActive,
                    ]}>
                    {item.approved ? 'Approved ✓' : 'Approve'}
                  </Text>
                </TouchableOpacity>

                {nextStatus && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => advanceStatus(item)}>
                    <Text style={styles.actionButtonText}>Mark {nextStatus}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />
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
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#F2F8F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2E4F',
    flexShrink: 1,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  instructions: {
    fontSize: 13,
    color: '#C0392B',
    marginTop: 4,
    fontStyle: 'italic',
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2E4F',
    marginTop: 6,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#1595B3',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonActive: {
    backgroundColor: '#1595B3',
  },
  actionButtonText: {
    color: '#1595B3',
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonTextActive: {
    color: '#FFF',
  },
});