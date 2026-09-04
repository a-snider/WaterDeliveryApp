import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AnimatedButton } from '@/components/animated-button';
import { OrderSuccess } from '@/components/order-success';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { db } from '@/firebase/config';

export default function CartScreen() {
  const { items, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [instructions, setInstructions] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('Not Logged In', 'Please log in before placing an order.');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Add a product before placing an order.');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        userEmail: user.email,
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          recurring: item.recurring,
          frequencyWeeks: item.frequencyWeeks,
        })),
        total,
        status: 'Scheduled',
        deliveryInstructions: instructions.trim(),
        createdAt: serverTimestamp(),
      });

      const recurringItems = items.filter((item) => item.recurring);
      for (const item of recurringItems) {
        await addDoc(collection(db, 'recurringOrders'), {
          userId: user.uid,
          userEmail: user.email,
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          frequencyWeeks: item.frequencyWeeks,
          deliveryInstructions: instructions.trim(),
          active: true,
          createdAt: serverTimestamp(),
        });
      }

      clearCart();
      setInstructions('');
      setOrderPlaced(true);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (orderPlaced) {
    return <OrderSuccess onDone={() => router.back()} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some products to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.product.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemDetail}>
                  Qty: {item.quantity} · ${(item.product.price * item.quantity).toFixed(2)}
                </Text>
                {item.recurring && (
                  <Text style={styles.recurringTag}>
                    🔁 Repeats every {item.frequencyWeeks} week
                    {item.frequencyWeeks !== 1 ? 's' : ''}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {items.length > 0 && (
        <>
          <Text style={styles.label}>Delivery Instructions (optional)</Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="e.g. Leave by the garage, gate code, etc."
            placeholderTextColor="#888"
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

          <AnimatedButton style={styles.button} onPress={handlePlaceOrder}>
            <Text style={styles.buttonText}>Place Order</Text>
          </AnimatedButton>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1595B3',
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B2E4F',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemDetail: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  recurringTag: {
    fontSize: 12,
    color: '#1595B3',
    marginTop: 2,
    fontWeight: '600',
  },
  remove: {
    color: '#C0392B',
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1595B3',
    marginBottom: 6,
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#FFF',
    textAlignVertical: 'top',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1595B3',
    marginTop: 20,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0B2E4F',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});