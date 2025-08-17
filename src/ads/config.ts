import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

export const bannerId = __DEV__ ? TestIds.BANNER : 'REPLACE_WITH_REAL_BANNER_ID';
export const interstitialId = __DEV__ ? TestIds.INTERSTITIAL : 'REPLACE_WITH_REAL_INTERSTITIAL_ID';
export const rewardedId = __DEV__ ? TestIds.REWARDED : 'REPLACE_WITH_REAL_REWARDED_ID';
export const appOpenId = __DEV__ ? TestIds.APP_OPEN : 'REPLACE_WITH_REAL_APP_OPEN_ID';
