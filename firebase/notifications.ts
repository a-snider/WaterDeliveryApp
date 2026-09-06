import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { doc, setDoc } from 'firebase/firestore';
import { Platform } from 'react-native';

import { db } from '@/firebase/config';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(userId: string) {
  console.log('Attempting to register push notifications for:', userId);

  if (!Device.isDevice) {
    console.log('Push notifications require a physical device.');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permission not granted.');
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: '1e8bca61-a200-4e8a-a264-e610f63fb427',
  });
  const pushToken = tokenData.data;
  console.log('Got push token:', pushToken);

  await setDoc(doc(db, 'users', userId), { pushToken }, { merge: true });

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return pushToken;
}

export async function sendPushNotification(pushToken: string, title: string, body: string) {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: pushToken,
      sound: 'default',
      title,
      body,
    }),
  });
  const data = await response.json();
  console.log('Expo push API response:', JSON.stringify(data));
  return data;
}