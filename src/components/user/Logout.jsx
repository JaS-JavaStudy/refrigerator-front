import { useEffect } from 'react';
import { userApi } from '@/sources/api/UserAPI';

const Logout = () => {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await userApi.logout();
        window.location.replace('/');
      } catch (error) {
        console.log(error);
        alert('로그아웃 중 오류가 발생했습니다.');
        window.location.replace('/');
      }
    };

    handleLogout();
  }, []);

  return null;
};

export default Logout;