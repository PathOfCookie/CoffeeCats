// src/index.tsx
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MobXContext } from './context/MobXContext';  /
import rootStore from './stores';                      
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <MobXContext.Provider value={rootStore}>            
    <App />
  </MobXContext.Provider>
);