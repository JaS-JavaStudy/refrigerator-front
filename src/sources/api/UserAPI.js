import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

export const userApi = {
  // 회원가입
  signup: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/join`, userData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  //로그인
  login: async (credentials) => {
    try {
      const formData = new FormData()
      formData.append('username', credentials.userId)
      formData.append('password', credentials.userPw)
  
      const response = await axios.post(`${BASE_URL}/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
  
      return response
    } catch (error) {
      throw error
    }
  },

  // 비밀번호 재발급
  resetPassword: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/password/reset`, data)
      return response.data
    } catch (error) {
      throw error
    }
  },
}