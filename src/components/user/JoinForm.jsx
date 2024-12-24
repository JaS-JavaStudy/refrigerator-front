import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { userApi } from '@/sources/api/UserAPI'
import { useNavigate } from 'react-router-dom'
import styles from '@/assets/css/user/Join.module.css'

const JoinForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    userId: '',
    userPw: '',
    userPwConfirm: '',
    userEmail: '',
    userNickname: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // 아이디 검증
    if (!formData.userId) {
      newErrors.userId = '아이디를 입력해주세요.'
    } else if (formData.userId.length < 4) {
      newErrors.userId = '아이디는 4자 이상이어야 합니다.'
    }

    // 비밀번호 검증
    if (!formData.userPw) {
      newErrors.userPw = '비밀번호를 입력해주세요.'
    } else if (formData.userPw.length < 8) {
      newErrors.userPw = '비밀번호는 8자 이상이어야 합니다.'
    }

    // 비밀번호 확인
    if (formData.userPw !== formData.userPwConfirm) {
      newErrors.userPwConfirm = '비밀번호가 일치하지 않습니다.'
    }

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.userEmail) {
      newErrors.userEmail = '이메일을 입력해주세요.'
    } else if (!emailRegex.test(formData.userEmail)) {
      newErrors.userEmail = '올바른 이메일 형식이 아닙니다.'
    }

    // 닉네임 검증
    if (!formData.userNickname) {
      newErrors.userNickname = '닉네임을 입력해주세요.'
    } else if (formData.userNickname.length < 2) {
      newErrors.userNickname = '닉네임은 2자 이상이어야 합니다.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0  // 모든 입력이 유효한 경우 폼 제출 진행행
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const isValid = validateForm()
      if (!isValid) {
        setIsSubmitting(false)
        return
      }

      const { userPwConfirm, ...submitData } = formData
      await userApi.signup(submitData)
      alert('회원가입이 완료되었습니다!')
      navigate('/login')
    } catch (error) {
      console.log('Error response:', error.response?.data)
      if (error.response?.status === 409) {
        // 서버에서 받은 문자열을 배열로 분리
        const errorMessages = error.response.data.split(', ')
      
        // 각 에러 메시지를 해당하는 필드에 매핑
        const fieldErrors = {}
        errorMessages.forEach(message => {
          if (message.includes('아이디')) fieldErrors.userId = message
          if (message.includes('이메일')) fieldErrors.userEmail = message
          if (message.includes('닉네임')) fieldErrors.userNickname = message
        })

        setErrors(prev => ({
          ...prev,
          ...fieldErrors
        }))
      } else {
        alert('회원가입 중 오류가 발생했습니다.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>아이디</label>
        <input
          className={styles.input}
          type="text"
          name="userId"
          placeholder="아이디를 입력하세요"
          value={formData.userId}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.userId && <span className={styles.error}>{errors.userId}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>비밀번호</label>
        <input
          className={styles.input}
          type="password"
          name="userPw"
          placeholder="비밀번호를 입력하세요"
          value={formData.userPw}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.userPw && <span className={styles.error}>{errors.userPw}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>비밀번호 확인</label>
        <input
          className={styles.input}
          type="password"
          name="userPwConfirm"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.userPwConfirm}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.userPwConfirm && <span className={styles.error}>{errors.userPwConfirm}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>이메일</label>
        <input
          className={styles.input}
          type="email"
          name="userEmail"
          placeholder="example@email.com"
          value={formData.userEmail}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.userEmail && <span className={styles.error}>{errors.userEmail}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>닉네임</label>
        <input
          className={styles.input}
          type="text"
          name="userNickname"
          placeholder="닉네임을 입력하세요"
          value={formData.userNickname}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.userNickname && <span className={styles.error}>{errors.userNickname}</span>}
      </div>

      <button
        type="submit"
        className={styles.button}
        disabled={isSubmitting}
      >
        {isSubmitting ? '처리중...' : '회원가입'}
      </button>
    </Form>
  )
}

export default JoinForm