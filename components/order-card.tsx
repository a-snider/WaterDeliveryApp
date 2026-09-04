import { StyleSheet, Text, View } from 'react-native';

import { FirestoreOrder } from '@/app/(tabs)/explore';
import { DeliveryProgress } from '@/components/delivery-progress';

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#2E8B57',
  'Out for Delivery': '#D98E04',
  Scheduled: '#1595B3',
};

export function OrderCard({ order }: { order: FirestoreOrder }) {
  const dateLabel = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleDateString()
    : 'Pending';

  const showProgress =
    order.approved && order.deliveryDate?.toDate && order.status !== 'Delivered';


  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.date}>{dateLabel}</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[order.status] || '#999' }]}>
          <Text style={styles.badgeText}>{order.status}</Text>
        </View>
      </View>

      {order.items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.items}>
            {item.quantity}x {item.name}
          </Text>
          {item.recurring && (
            <Text style={styles.recurringTag}>
              🔁 Every {item.frequencyWeeks} week{item.frequencyWeeks !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      ))}

      <Text style={styles.total}>${order.total.toFixed(2)}</Text>

      {showProgress && (
        <DeliveryProgress
          createdAt={order.createdAt.toDate()}
          deliveryDate={order.deliveryDate.toDate()}
        />
      )}
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
  itemRow: {
    marginBottom: 4,
  },
  items: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  recurringTag: {
    fontSize: 12,
    color: '#1595B3',
    fontWeight: '600',
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2E4F',
    marginTop: 4,
  },
});