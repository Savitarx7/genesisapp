import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';

jest.mock('expo-linear-gradient');
jest.mock('@expo/vector-icons');

import MainScreen from '../screens/MainScreen';

describe('MainScreen', () => {
  it('increments tokens and shows popup when Mine button pressed', () => {
    const { getByText, queryByText } = render(<MainScreen />);
    fireEvent.press(getByText('Mine'));
    expect(getByText(/Total Tokens: 0.01/)).toBeTruthy();
    expect(queryByText('Mining started: 0.01 per hour for 24 hours')).toBeTruthy();
  });

  it('auto counter increases when mining', () => {
    jest.useFakeTimers();
    const { getByText } = render(<MainScreen />);
    fireEvent.press(getByText('Mine'));
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getByText(/Auto Counter: 3/)).toBeTruthy();
    jest.useRealTimers();
  });
});
