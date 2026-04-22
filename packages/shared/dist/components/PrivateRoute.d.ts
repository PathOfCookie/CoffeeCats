import React from 'react';
interface PrivateRouteProps {
    children?: React.ReactNode;
    isAuthenticated: boolean;
}
export declare const PrivateRoute: React.FC<PrivateRouteProps>;
export {};
