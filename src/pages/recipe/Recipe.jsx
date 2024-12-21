import { useEffect, useState,useCallback } from "react"
import { getRecipeList } from "../../sources/api/recipeAPI.jsx";
import {Route, useNavigate} from "react-router-dom";
import { AddRecipe} from "./addRecipe.jsx";

function Recipe() {
    const [recipeList, setRecipeList] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getRecipeList();
                setRecipeList(data); // 상태 업데이트
                console.log(recipeList); // 가져온 데이터 확인
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
            <ul>
                <li>
                    <button onClick={handleAdd}>add button</button>
                </li>
            </ul>
        </>
    )
}

export default Recipe