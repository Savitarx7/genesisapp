import React from 'react';
import { View } from 'react-native';

export const LinearGradient = (props) => {
  const { children, ...rest } = props;
  return <View {...rest}>{children}</View>;
};

export default { LinearGradient };
