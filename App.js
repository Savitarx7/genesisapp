import React, { useEffect } from 'react';
import AppNavigator from './Navigation';
import { mobileAds } from 'react-native-google-mobile-ads';

export default function App() {
  useEffect(() => {
    mobileAds().initialize();
  }, []);

  return <AppNavigator />;
}
