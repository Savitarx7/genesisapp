import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import mobileAds from 'react-native-google-mobile-ads';

import AuthScreen from './screens/AuthScreen';
import MainScreen from './screens/MainScreen';
import { auth } from './firebaseConfig';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [fontsLoaded] = useFonts({
    'FiraCode-Regular': require('./assets/fonts/FiraCode-Regular.ttf'),
    'FiraCode-Bold': require('./assets/fonts/FiraCode-Bold.ttf'),
  });

  useEffect(() => {
    mobileAds().initialize();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {user ? (
          <Stack.Screen name="Main" component={MainScreen} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
