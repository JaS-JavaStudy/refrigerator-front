import React from "react";
import style from '@/assets/css/main/footer.module.css';

function Footer() {
    return (
        <footer className={style.footer}>
            <div className={style.leftSection}>
                <h1 className={style.logo}>
                    <span className={style.logoReci}>Reci</span>
                    <span className={style.logoPick}>Pick</span>
                </h1>
                <div className={style.socialIcons}>
                    <a href="#" className={style.icon}>✖</a>
                    <a href="#" className={style.icon}>📸</a>
                    <a href="#" className={style.icon}>▶</a>
                    <a href="#" className={style.icon}>💼</a>
                </div>
            </div>
            <div className={style.rightSection}>
                <div className={style.linksGroup}>
                    <h3>Home</h3>
                    <a href="#">Resource library</a>
                </div>
                <div className={style.linksGroup}>
                    <h3>Fridge</h3>
                    <a href="#">Ingredient</a>
                </div>
                <div className={style.linksGroup}>
                    <h3>Recipe</h3>
                    <a href="#">Online whiteboard</a>
                    <a href="#">Team collaboration</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
