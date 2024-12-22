import { useEffect, useState,useCallback } from "react"
import { getRecipeList } from "../../sources/api/recipeAPI.jsx";
import {Route, useNavigate} from "react-router-dom";
import { AddRecipe} from "./addRecipe.jsx";
import RecipeItem from "../../components/recipe/recipeItem.jsx"
import "../../assets/css/recipe/recipe.css"

function Recipe() {
    const [recipeList, setRecipeList] = useState([])
    const navigate = useNavigate();

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
            <div className="recipe-wrapper">
                {recipeList.map((recipe) => (
                    <RecipeItem key={recipe.recipePk} recipe={recipe} />
                ))}
            </div>
            <ul>
                <li>
                    <button onClick={handleAdd}>add button</button>
                </li>
            </ul>
        </>
    )
}

export default Recipe