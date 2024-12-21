import JoinForm from '../../components/user/JoinForm'
import { Container } from "react-bootstrap"
import '../../assets/css/user/Join.css'

const Join = () => {
  return ( 
    <Container className="join-container">
      <h2>회원가입</h2>
      <p>ReciPick의 회원이 되어 나만을 위한 맞춤 레시피를 만나보세요.</p>
      <JoinForm />
    </Container>
   )
}
 
export default Join