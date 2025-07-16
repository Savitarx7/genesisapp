import React from 'react';
import { render } from '@testing-library/react-native';
import GameScreen from '../screens/GameScreen';

jest.mock('expo-av', () => ({ Audio: { Sound: { createAsync: jest.fn(() => Promise.resolve({ sound: { playAsync: jest.fn(), setOnPlaybackStatusUpdate: jest.fn(), unloadAsync: jest.fn() } })) } } }), { virtual: true });
jest.mock('../assets/audio/song1.mp3', () => 'song1');
jest.mock('../assets/audio/song2.mp3', () => 'song2');
jest.mock('../assets/audio/song3.mp3', () => 'song3');

test('renders without crashing', () => {
  render(<GameScreen />);
});
