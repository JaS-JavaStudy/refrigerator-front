import { useEffect, useState } from "react";
import { getUsersIngredient } from "../../../sources/api/IngredientAPI";
import UsersIngredientItem from "./UsersIngredientItem";
import style from '../../../assets/css/Ingredient/userIngredient/UsersIngredient.module.css';

function UserIngredient() {
    const [usersIngredientList, setUserIngredientList] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [category, setCategory] = useState("전체");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const categories = [
        "전체", "채소", "과일", "육류", "해산물", "유제품",
        "계란", "장류", "소스", "음료", "곡물", "견과류",
        "반찬", "완제품"
    ];

    const fetchIngredients = async () => {
        try {
            const data = await getUsersIngredient();
            setUserIngredientList(data);
            setFilteredIngredients(data);
        } catch (err) {
            console.error(err);
        }
    };

    // 초기 로딩
    useEffect(() => {
        fetchIngredients();
    }, []);

    // 재료 추가 이벤트 리스너
    useEffect(() => {
        const handleIngredientAdded = () => {
            fetchIngredients(); // 재료 목록 새로고침
        };

        window.addEventListener('ingredientAdded', handleIngredientAdded);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('ingredientAdded', handleIngredientAdded);
        };
    }, []);

    // 필터링 로직
    useEffect(() => {
        let filtered = usersIngredientList;

        if (category !== "전체") {
            filtered = filtered.filter(
                (ingredient) => ingredient.ingredientCategory === category
            );
        }

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
