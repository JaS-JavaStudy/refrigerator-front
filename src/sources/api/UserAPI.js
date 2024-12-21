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
}