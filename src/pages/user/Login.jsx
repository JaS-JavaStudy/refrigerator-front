import LoginForm from "../../components/user/LoginForm"
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import styles from "../../assets/css/user/Login.module.css"

const Login = () => {
  return ( 
    <Container className={styles.container}>
      <h2 className={styles.title}>로그인</h2>
      <LoginForm />
      <p className={styles.joinLink}>
        <Link to="/join">
          아직 ReciPick의 회원이 아니신가요?
        </Link>
      </p>
    </Container>
   )
}
 
export default Login