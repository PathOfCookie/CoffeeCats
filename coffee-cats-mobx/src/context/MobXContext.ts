// src/context/MobXContext.ts
import React from 'react';
import rootStore from '../stores';

export const MobXContext = React.createContext(rootStore);

export const useStores = () => {
  const store = React.useContext(MobXContext);
  if (!store) {
    throw new Error('useStores must be used within MobXProvider');
  }
  return store;
};