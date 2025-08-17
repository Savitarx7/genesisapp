import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';

jest.mock('expo-linear-gradient');
jest.mock('@expo/vector-icons');

jest.mock('react-native-google-mobile-ads', () => {
  const reward = {
    loaded: false,
    load: jest.fn(),
    show: jest.fn(),
    addAdEventListener: jest.fn(() => jest.fn()),
  };
  const BannerAd = () => null;
  const BannerAdSize = { ADAPTIVE_BANNER: 'ADAPTIVE_BANNER' };
  return {
    RewardedAd: { createForAdRequest: jest.fn(() => reward) },
    RewardedAdEventType: { LOADED: 'loaded', EARNED_REWARD: 'earned', CLOSED: 'closed' },
    TestIds: {
      REWARDED: 'test-id',
      BANNER: 'test-banner',
      INTERSTITIAL: 'test-interstitial',
      APP_OPEN: 'test-app-open',
    },
    BannerAd,
    BannerAdSize,
    __reward: reward,
  };
});

jest.mock('../firebaseConfig', () => ({
  auth: () => ({ onAuthStateChanged: jest.fn(() => jest.fn()) }),
  database: () => ({}),
}));

jest.mock('@react-native-firebase/auth', () => () => ({ onAuthStateChanged: jest.fn(() => jest.fn()) }));
jest.mock('@react-native-firebase/database', () => ({ ref: jest.fn(), get: jest.fn(), set: jest.fn(), onValue: jest.fn() }));

describe('MainScreen', () => {
  let rewardMock;
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    rewardMock = require('react-native-google-mobile-ads').__reward;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows ad when loaded and button pressed', () => {
    rewardMock.loaded = true;
    const MainScreen = require('../screens/MainScreen').default;
    const { getByText } = render(<MainScreen />);
    fireEvent.press(getByText('Mine'));
    expect(rewardMock.show).toHaveBeenCalled();
  });

  it('loads ad and alerts when not ready', () => {
    rewardMock.loaded = false;
    const alertSpy = jest.spyOn(Alert, 'alert');
    const MainScreen = require('../screens/MainScreen').default;
    const { getByText } = render(<MainScreen />);
    fireEvent.press(getByText('Mine'));
    expect(rewardMock.load).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Ad not ready', 'Please try again in a few seconds.');
  });

  it('shows popup after earning reward', () => {
    rewardMock.loaded = true;
    const MainScreen = require('../screens/MainScreen').default;
    const { getByText, queryByText } = render(<MainScreen />);
    const earnHandler = rewardMock.addAdEventListener.mock.calls.find(c => c[0] === 'earned')[1];
    act(() => {
      earnHandler();
    });
    expect(queryByText('Mining started: 0.01 per hour for 24 hours')).toBeTruthy();
  });
});
