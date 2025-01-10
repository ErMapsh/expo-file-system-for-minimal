import { registerRootComponent } from 'expo';
import App from './App';
import "./global.css";

import notifee, {
    AndroidImportance,
    AndroidVisibility,
    EventType,
} from '@notifee/react-native';

import messaging from '@react-native-firebase/messaging';

const notification = async (remoteMessage: any, event = 'back') => {
    try {
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            sound: 'default',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
        });

        await notifee.displayNotification({
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            android: {
                color: '#006874',
                // ongoing: true,
                channelId,
                smallIcon: 'ic_stat_notifications_active',
                actions:
                    event == 'fore'
                        ? [
                            {
                                title: 'Open',
                                pressAction: { id: 'open' },
                            },
                            {
                                title: 'Dismiss',
                                pressAction: { id: 'dismiss' },
                            },
                        ]
                        : [],
            },
            ios: {
                critical: true,
                criticalVolume: 0.9,
                foregroundPresentationOptions: {
                    badge: true,
                    sound: true,
                    banner: true,
                    list: true,
                },
            },
        });
    } catch (error) {
        console.error('Notification error:', error);
    }
};

messaging().onMessage(async remoteMessage => {
    console.log('Message handled in the foreground!', remoteMessage);
    if (
        remoteMessage &&
        remoteMessage?.notification?.title &&
        remoteMessage.notification?.body
    ) {
        await notification(remoteMessage, 'fore');
    }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    if (
        remoteMessage &&
        remoteMessage?.notification?.title &&
        remoteMessage.notification?.body
    ) {
        await notification(remoteMessage, 'back');
    }
});

notifee.onBackgroundEvent(async ({ type, detail }: any) => {
    const { notification, pressAction } = detail;

    if (type === EventType.ACTION_PRESS) {
        if (pressAction.id === 'open') {
            console.log('Open button pressed in the background');
            try {
                // navigate('BottomNavigation', { screen: 'PillReminder' });
            } catch (error) {
                console.error(error);
            }
        }

        if (pressAction.id === 'dismiss') {
            console.log('Dismiss button pressed in the background');
            // Handle the 'Dismiss' action here
            await notifee.cancelNotification(notification.id);
        }
    }
});

notifee.onForegroundEvent(async ({ type, detail }: any) => {
    const { notification, pressAction } = detail;

    if (type === EventType.ACTION_PRESS) {
        if (pressAction.id === 'open') {
            console.log('Open button pressed in the background');
            try {
                // navigate('BottomNavigation', { screen: 'PillReminder' });
            } catch (error) {
                console.error(error);
            }
        }

        if (pressAction.id === 'dismiss') {
            console.log('Dismiss button pressed in the background');
            await notifee.cancelNotification(notification.id);
        }
    }
});


registerRootComponent(App);
