import { StyleSheet, Text, View } from 'react-native';

import { Order } from '@/constants/orders';

const STATUS_COLORS: Record<Order['status'], string> = {
  Delivered: '#2E8B57',
  'Out for Delivery': '#D98E04',
  Scheduled: '#1595B3',
};

export function OrderCard({ order }: { order: Order }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.date}>{order.date}</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[order.status] }]}>
          <Text style={styles.badgeText}>{order.status}</Text>
        </View>
      </View>
      <Text style={styles.items}>{order.items}</Text>
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