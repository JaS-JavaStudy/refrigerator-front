import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../../assets/css/main/header.module.css";

function Header() {
    const [userPk, setUserPk] = useState(null); // JWT에서 추출한 userPk
    const [alerts, setAlerts] = useState([]); // 알림 데이터
    const [showAlerts, setShowAlerts] = useState(false); // 알림 표시 여부

    // JWT에서 userPk 추출하는 함수
    function getUserPkFromToken(token) {
        try {
            const payload = token.split(".")[1]; // 토큰의 payload 부분
            const decoded = JSON.parse(atob(payload)); // Base64 디코딩 후 JSON 파싱
            return decoded.username; // username에 담긴 userPk 반환
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    }

    // API 요청 함수
    async function fetchAlerts(userPk) {
        try {
            const response = await axios({
                method: "post",
                url: "http://localhost:8080/ingredient/alert",
                data: { userPk },
            });
            setAlerts(response.data);
        } catch (error) {
            console.error("Failed to fetch alerts:", error);
        }
    }

    // 컴포넌트가 마운트될 때 실행
    useEffect(() => {
        const token = localStorage.getItem("token"); // 로컬스토리지에서 JWT 가져오기
        if (token) {
            const extractedUserPk = getUserPkFromToken(token); // userPk 추출
            setUserPk(extractedUserPk); // 상태 업데이트
            if (extractedUserPk) {
                fetchAlerts(extractedUserPk); // API 호출
            }
        }
    }, []);

    return (
        <header className={style.header}>
            <div className={style.logo}>
                <h1>
                    <span className={style.logoReci}>Reci</span>
                    <span className={style.logoPick}>Pick</span>
                </h1>
            </div>
            <nav className={style.nav}>
                <a href="/">홈</a>
                <a href="/ingredient">내 냉장고</a>
                <a href="/recipe">레시피</a>
                {userPk ? (
                    <>
                        <a href="/logout">로그아웃</a>
                        <div
                            className={style.alertContainer}
                            onMouseEnter={() => setShowAlerts(true)} // 마우스를 올렸을 때
                            onMouseLeave={() => setShowAlerts(false)} // 마우스가 벗어났을 때
                        >
                            <span>알림 ({alerts.length})</span>
                            {showAlerts && (
                                <div className={style.alerts}>
                                    {alerts.length > 0 ? (
                                        <ul>
                                            {alerts.map((alert) => (
                                                <li key={alert.ingredientMyRefrigeratorPk}>
                                                    {alert.ingredientManagement.ingredientName} 
                                                    ({alert.ingredientManagement.ingredientStorage.ingredientStorage})
                                                    - {alert.remainDate}일 남음
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>알림이 없습니다.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <a href="/login">로그인</a>
                )}
            </nav>
        </header>
    );
}

export default Header;
