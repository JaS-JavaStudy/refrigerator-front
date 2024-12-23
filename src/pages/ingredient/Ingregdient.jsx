// Ingredient.jsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import UsersIngredient from "../../components/ingredient/userIngredient/UsersIngredient"
import SearchIngredient from "../../components/ingredient/searchIngredient/SearchIngredient"
import style from '../../assets/css/ingredient/ingredient/Ingredient.module.css'

function Ingredient() {
    const navigate = useNavigate();
    const [userPk, setUserPk] = useState(null);

    useEffect(() => {
        // token에서 userPk 추출
        const checkLogin = () => {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('로그인이 필요한 서비스입니다.');
                navigate('/login');
                return;
            }

            try {
                const payload = token.split(".")[1];
                const decoded = JSON.parse(atob(payload));
                const extractedUserPk = decoded.username;

                if (!extractedUserPk) {
                    alert('사용자 정보를 찾을 수 없습니다.');
                    navigate('/login');
                    return;
                }

                setUserPk(extractedUserPk);
            } catch (error) {
                console.error("Failed to decode token:", error);
                alert('로그인 정보가 유효하지 않습니다.');
                navigate('/login');
            }
        };

        checkLogin();
    }, [navigate]);

    // userPk가 없으면 렌더링하지 않음
    if (!userPk) {
        return null;
    }

    return (
        <main className={style.mainLayout}>
            <div className={style.searchSection}>
                <SearchIngredient />
            </div>
            <div className={style.refrigeratorSection}>
                <UsersIngredient />
            </div>
        </main>
    );
}

export default Ingredient;