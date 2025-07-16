/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';

test('dummy render', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<Text>OK</Text>);
  });
});
