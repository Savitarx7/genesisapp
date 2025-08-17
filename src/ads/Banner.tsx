import React from 'react';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { bannerId } from './config';

export default function Banner() {
  return <BannerAd unitId={bannerId} size={BannerAdSize.ADAPTIVE_BANNER} />;
}
