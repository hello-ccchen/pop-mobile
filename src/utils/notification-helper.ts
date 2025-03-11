import notifee, {AndroidImportance} from '@notifee/react-native';

export const requestUserPermissionForNotification = async () => {
  await notifee.requestPermission();
};

export const displayNotification = async (title: string, body: string) => {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
};
