// UserAPI.js
import axios from "axios";

const BASE_URL = "http://localhost:8080";

// axios 인터셉터 설정
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// 토큰 검증 함수
export const validateToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await axios.get(`${BASE_URL}/auth/validate`);
    return response.status === 200;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
};



export const userApi = {
  // 회원가입
  signup: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/join`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },

  // 로그인
  login: async (credentials) => {
    try {
      const formData = new FormData();
      formData.append("username", credentials.userId);
      formData.append("password", credentials.userPw);

      const response = await axios.post(`${BASE_URL}/login`, formData);
      const token = response.headers.authorization;

      if (token) {
        localStorage.setItem("token", token);
      }
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },

  // 비밀번호 재발급
  resetPassword: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/password/reset`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      const response = await axios.post(`${BASE_URL}/logout`);
      localStorage.removeItem("token");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },
};
