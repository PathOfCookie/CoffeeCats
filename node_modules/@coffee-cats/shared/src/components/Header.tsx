// packages/shared/src/components/Header.tsx
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  activePage: string;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigate, activePage }) => {
  const pages = [
    { id: 'products', label: '📦 Товары', icon: '☕' },
    { id: 'cats', label: '🐱 Котики', icon: '🐱' },
  ];

  return (
    <header style={{
      background: 'linear-gradient(135deg, #8b4513, #d2691e)',
      color: 'white',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ fontSize: '32px' }}>😺</span>
        <h1 style={{ margin: 0, fontSize: '24px' }}>CoffeeCats</h1>
      </div>

      <nav style={{ display: 'flex', gap: '10px' }}>
        {pages.map(page => (
          <button
            key={page.id}
            onClick={() => onNavigate(page.id)}
            style={{
              padding: '8px 20px',
              background: activePage === page.id ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{page.icon}</span>
            {page.label}
          </button>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>👤 {user?.name || 'Гость'}</span>
        <button
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '20px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Выйти
        </button>
      </div>
    </header>
  );
};