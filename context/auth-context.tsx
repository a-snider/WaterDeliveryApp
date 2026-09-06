import { onAuthStateChanged, User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { auth } from '@/firebase/config';
import { registerForPushNotifications } from '@/firebase/notifications';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    console.log('AUTH STATE:', firebaseUser?.uid);

    setUser(firebaseUser);
    setLoading(false);

    if (firebaseUser) {
      console.log('STARTING PUSH REGISTRATION');

      registerForPushNotifications(firebaseUser.uid)
        .then((token) => {
          console.log('PUSH REGISTRATION RESULT:', token);
        })
        .catch((error) => {
          console.error('PUSH REGISTRATION ERROR:', error);
        });
    }
  });

  return unsubscribe;
}, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}