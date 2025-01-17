import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { userApi } from '../../sources/api/UserAPI';
import styles from '../../assets/css/user/Login.module.css';

const LoginForm = ({ onPasswordReset }) => {
  const [formData, setFormData] = useState({
    userId: '',
    userPw: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await userApi.login(formData);
      window.location.href = '/';  // 로그인 성공 시 홈으로 이동
    } catch (error) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>아이디</label>
        <input
          className={styles.input}
          type="text"
          name="userId"
          placeholder="아이디를 입력하세요."
          value={formData.userId}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>비밀번호</label>
        <input
          className={styles.input}
          type="password"
          name="userPw"
          placeholder="비밀번호를 입력하세요."
          value={formData.userPw}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        className={styles.button}
        disabled={isSubmitting}
      >
        {isSubmitting ? '로그인 중...' : '로그인'}
      </button>

      <div className={styles.passwordReset}>
        <button
          type="button"
          onClick={onPasswordReset}
          className={styles.resetButton}
        >
          비밀번호 찾기
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </Form>
  );
};

export default LoginForm;