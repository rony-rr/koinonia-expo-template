import { StatusBar } from 'expo-status-bar';
import React,{ useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { StyleSheet, Text, View, TouchableOpacity, Button, Platform } from 'react-native';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');

  const [redirecciona, setRedirecciona] = useState('');

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {

      console.log(response);

      setRedirecciona(response.notification.request.content.data.url)

      

    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  //se coloca un sitio por defecto para abrir cuando no hay notificacion push
  if(redirecciona == ''){
    return(<WebView 
      style={styles.container}
      source={{ uri: 'https://www.google.com' }}
    />);
  }else{
    //se obtiene el url de el body de la notificacion push
    // ejemplo de body json {"url":"http://www.youtube.com/","type":"1"}
    return (
      <WebView 
      style={styles.container}
      source={{ uri: redirecciona }}
    />
  );
  }

  
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
