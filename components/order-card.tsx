import { StyleSheet, Text, View } from 'react-native';

import { FirestoreOrder } from '@/app/(tabs)/explore';

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#2E8B57',
  'Out for Delivery': '#D98E04',
  Scheduled: '#1595B3',
};

export function OrderCard({ order }: { order: FirestoreOrder }) {
  const dateLabel = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleDateString()
    : 'Pending';

  const itemsLabel = order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ');

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.date}>{dateLabel}</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[order.status] || '#999' }]}>
          <Text style={styles.badgeText}>{order.status}</Text>
        </View>
      </View>
      <Text style={styles.items}>{itemsLabel}</Text>
      <Text style={styles.total}>${order.total.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
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
  items: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2E4F',
  },
});