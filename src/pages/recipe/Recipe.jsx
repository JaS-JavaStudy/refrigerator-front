import { useEffect, useState,useCallback } from "react"
import { getRecipeList } from "../../sources/api/recipeAPI.jsx";
import {Link, Route, useNavigate} from "react-router-dom";
import { AddRecipe} from "./addRecipe.jsx";
import RecipeItem from "../../components/recipe/RecipeItem.jsx"
import "../../assets/css/recipe/recipe.css"


function Recipe() {
    const [recipeList, setRecipeList] = useState([])
    const navigate = useNavigate();
    const userPk = localStorage.getItem('userPk');
    //userPk 를 어떻게 처리할지에 따라 바꿀듯합니다.

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getRecipeList();
                console.log("recipeList",data); // 가져온 데이터 확인
                setRecipeList(data); // 상태 업데이트
            } catch (err) {
                console.error(err);
            }
        };

        fetchRecipes(); // 비동기 작업 호출
    }, []);

    const handleAdd = useCallback(() => {
        navigate("/recipe/create");
    },[navigate])

    return (
        <>
            <h1>레시피 페이지</h1>
            <div>
                <button onClick={handleAdd}>레시피 추가</button>
                <Link to={`/recipe/recommend/${userPk}`}
                      className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
                    맞춤 레시피 보기
                </Link>
            </div>
            <div className="recipe-wrapper">
                {recipeList.map((recipe) => (
                    <RecipeItem key={recipe.recipePk} recipe={recipe} />
                ))}
            </div>

        </>
    )
}
export default Recipe