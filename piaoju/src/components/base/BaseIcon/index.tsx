import React from 'react';
import * as icons from '@ant-design/icons';

const BaseIcon = (props: { name: string }) => {
  const { name } = props;
  const antIcon: Record<string, any> = icons;
  return React.createElement(antIcon[name]);
};

export default BaseIcon;
