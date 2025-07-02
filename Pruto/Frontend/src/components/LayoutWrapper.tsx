'use client';

import React from 'react';
import Layout from './Layout'; 

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Layout>{children}</Layout>;
};

export default LayoutWrapper;
