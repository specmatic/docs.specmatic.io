import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function PlatformTabs({ children }) {
  return (
    <Tabs>
      {children}
    </Tabs>
  );
}

export function Platform({ value, label, children }) {
  return (
    <TabItem value={value} label={label}>
      {children}
    </TabItem>
  );
}
