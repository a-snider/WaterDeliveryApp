import { FlatList, StyleSheet, Text, View } from 'react-native';

import { OrderCard } from '@/components/order-card';
import { ORDERS } from '@/constants/orders';

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      <FlatList
        data={ORDERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.list}
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
});