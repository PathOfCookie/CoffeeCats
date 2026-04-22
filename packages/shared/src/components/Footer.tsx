// packages/shared/src/components/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: '#5a3e2b',
      color: '#e6c9a8',
      textAlign: 'center',
      padding: '15px',
      marginTop: 'auto'
    }}>
      <p>🐱 CoffeeCats — антикафе с котиками | {new Date().getFullYear()}</p>
      <p style={{ fontSize: '12px', marginTop: '5px' }}>Микрофронтенд приложение с Module Federation</p>
    </footer>
  );
};