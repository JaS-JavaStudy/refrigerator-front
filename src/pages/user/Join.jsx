import JoinForm from '@/components/user/JoinForm'
import { Container } from "react-bootstrap"
import styles from '@/assets/css/user/Join.module.css'

const Join = () => {
  return ( 
    <Container className={styles.container}>
      <h2 className={styles.title}>회원가입</h2>
      <p className={styles.description}>ReciPick의 회원이 되어 나만을 위한 맞춤 레시피를 만나보세요.</p>
      <JoinForm />
    </Container>
   )
}
 
export default Join