import PushNotification from 'react-native-push-notification';



PushNotification.createChannel(
    {
      channelId: "55",
      channelName: "My channel", 
      channelDescription: "A channel to categorise your notifications",
      playSound: false, 
      soundName: "default", 
      vibrate: true, 
    },
    (created) => console.log(`createChannel returned '${created}'`) 
  );



PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  senderID: 'YOUR_GCM_OR_FCM_SENDER_ID',

  popInitialNotification: true,
  requestPermissions: true,
});
