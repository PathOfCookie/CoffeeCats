// packages/host/src/App.tsx
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header, Footer, PrivateRoute, User } from '@coffee-cats/shared';

// Ленивая загрузка микрофронтендов
const AuthPage = lazy(() => import('mf_auth/AuthPage'));
const ProductsTable = lazy(() => import('mf_products/ProductsTable'));
const CatsTable = lazy(() => import('mf_cats/CatsTable'));

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
      if (location.pathname === '/' || location.pathname === '/auth') {
        navigate('/products');
      }
    } else if (location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [location.pathname, navigate]);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/products');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  const getActivePage = () => {
    if (location.pathname.includes('/products')) return 'products';
    if (location.pathname.includes('/cats')) return 'cats';
    return 'products';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>📦 Загрузка...</div>}>
        <Routes>
          <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route
              element={
                <>
                  <Header
                    user={user}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                    activePage={getActivePage()}
                  />
                  <main style={{ flex: 1, padding: '30px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                    <Outlet />
                  </main>
                </>
              }
            >
              <Route path="products" element={<ProductsTable user={user} />} />
              <Route path="cats" element={<CatsTable user={user} />} />
              <Route index element={<ProductsTable user={user} />} />
            </Route>
          </Route>
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? '/products' : '/auth'}
                replace
              />
            }
          />
        </Routes>
      </Suspense>

      <Footer />
    </div>
  );
};

export default App;