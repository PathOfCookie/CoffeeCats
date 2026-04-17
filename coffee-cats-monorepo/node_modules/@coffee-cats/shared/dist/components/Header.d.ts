import React from 'react';
import { User } from '../types';
interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    onNavigate: (page: string) => void;
    activePage: string;
}
export declare const Header: React.FC<HeaderProps>;
export {};
