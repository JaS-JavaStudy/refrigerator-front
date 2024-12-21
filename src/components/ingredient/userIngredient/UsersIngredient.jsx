import { useEffect, useState } from "react";
import { getUsersIngredient } from "../../../sources/api/IngredientAPI";
import UsersIngredientItem from "./UsersIngredientItem";
import style from '../../../assets/css/Ingredient/userIngredient/UsersIngredient.module.css';

function UserIngredient() {
    const [usersIngredientList, setUserIngredientList] = useState([]); // 전체 재료 목록
    const [filteredIngredients, setFilteredIngredients] = useState([]); // 필터링된 재료 목록
    const [category, setCategory] = useState("전체"); // 선택된 카테고리
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // 즐겨찾기 필터 상태

    const categories = [
        "전체", "채소", "과일", "육류", "해산물", "유제품",
        "계란", "장류", "소스", "음료", "곡물", "견과류",
        "반찬", "완제품"
    ];

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const data = await getUsersIngredient(); // 서버 데이터 호출
                setUserIngredientList(data); // 전체 데이터 설정
                setFilteredIngredients(data); // 초기 필터링 데이터 설정
            } catch (err) {
                console.error(err);
            }
        };

        fetchIngredients(); // 비동기 작업 호출
    }, []);

    useEffect(() => {
        let filtered = usersIngredientList;

        // 카테고리 필터링
        if (category !== "전체") {
            filtered = filtered.filter(
                (ingredient) => ingredient.ingredientCategory === category
            );
        }

        // 즐겨찾기 필터링
        if (showFavoritesOnly) {
            filtered = filtered.filter((ingredient) => ingredient.bookmarked === true);
        }

        setFilteredIngredients(filtered);
    }, [category, showFavoritesOnly, usersIngredientList]);

    return (
        <div className={style.container}>
            <div className={style.header}>
                <h1>내 냉장고</h1>
                <div className={style.filters}>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={style.filterDropdown}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <button
                        className={`${style.favoriteButton} ${showFavoritesOnly ? style.active : ''}`}
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    >
                        {showFavoritesOnly ? "즐겨찾기 ✓" : "즐겨찾기"}
                    </button>
                </div>
            </div>
            <div className={style.cardContainer}>
                {filteredIngredients.map((ingredient) => (
                    <UsersIngredientItem
                        key={ingredient.ingredientMyRefrigeratorPk}
                        userIngredient={ingredient}
                    />
                ))}
            </div>
        </div>
    );
}

export default UserIngredient;
