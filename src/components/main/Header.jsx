import React from "react";
import style from '../../assets/css/main/header.module.css';

function Header() {
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
                <a href="/ingredient">즐겨찾기</a>
                <a href="/login">로그인</a>
            </nav>
        </header>
    );
}

export default Header;
