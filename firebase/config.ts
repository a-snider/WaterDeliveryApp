import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBr5p1PE1r-mlrrzOpncSSjymPM5ik7uSk',
  authDomain: 'mountainparkspringwater-a873b.firebaseapp.com',
  projectId: 'mountainparkspringwater-a873b',
  storageBucket: 'mountainparkspringwater-a873b.firebasestorage.app',
  messagingSenderId: '280455418588',
  appId: '1:280455418588:web:14fa1ae0ad2f7c7f08da19',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);