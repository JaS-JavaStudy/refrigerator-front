import { Navigate } from "react-router-dom"

const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token')

  // 로그인 상태라면 홈으로 리다이렉트
  if (token) {
    alert('이미 로그인되어 있습니다.')
    return <Navigate to="/" replace={true} />
  }

  return children
}
 
export default PublicOnlyRoute