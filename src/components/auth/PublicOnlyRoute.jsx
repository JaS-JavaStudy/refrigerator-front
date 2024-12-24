import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { validateToken } from '@/sources/api/UserAPI';

const PublicOnlyRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateToken();
      setIsAuthenticated(isValid);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null; // 또는 로딩 컴포넌트
  }

  if (isAuthenticated) {
    alert('이미 로그인되어 있습니다.');
    return <Navigate to="/" replace={true} />;
  }

  return children;
};

export default PublicOnlyRoute;