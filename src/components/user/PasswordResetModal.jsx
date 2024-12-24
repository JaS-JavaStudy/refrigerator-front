import { useState, useEffect } from "react"
import { userApi } from "@/sources/api/UserAPI"
import styles from '@/assets/css/user/PasswordResetModal.module.css'

const PasswordResetModal = ({show, onHide}) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!show) {
      setEmail('') 
      setError('')
      setIsSubmitting(false)
    }
  }, [show])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await userApi.resetPassword({ userEmail: email })
      alert('입력하신 이메일로 임시 비밀번호가 발송되었습니다.')
      onHide()
    } catch (error) {
      setError('비밀번호 재발급 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!show) return null

  return ( 
    <div className={styles.modalBackdrop} onClick={onHide}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h4>비밀번호 찾기</h4>
          <button 
            onClick={onHide} 
            className={styles.closeButton}
          >
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.description}>
            가입하신 이메일 주소를 입력하시면<br />
            임시 비밀번호를 발송해 드립니다.
          </p>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>이메일</label>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                disabled={isSubmitting}
                className={styles.input}
              />
              {error && <div className={styles.error}>{error}</div>}
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? '처리중...' : '임시 비밀번호 발급'}
            </button>
          </form>
        </div>
      </div>
    </div>
   )
}
 
export default PasswordResetModal