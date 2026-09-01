import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const translateY = useRef(new Animated.Value(100)).current;

  const showToast = (msg: string) => {
    setMessage(msg);
    setVisible(true);

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.spring(translateY, {
        toValue: 100,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, 2000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[styles.toast, { transform: [{ translateY }] }]}
          pointerEvents="none">
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#0B2E4F',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  text: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});