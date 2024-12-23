import { useEffect, useState,useCallback } from "react"
import { getRecipeList } from "../../sources/api/recipeAPI.jsx";
import {Link, Route, useNavigate} from "react-router-dom";
import { AddRecipe} from "./addRecipe.jsx";
import RecipeItem from "../../components/recipe/RecipeItem.jsx"
import style from "../../assets/css/recipe/recipe.module.css"


function Recipe() {
    const [recipeList, setRecipeList] = useState([])
    const [search, setSearch] = useState("")
    const navigate = useNavigate();
    const userPk = localStorage.getItem('userPk');
    //userPk 를 어떻게 처리할지에 따라 바꿀듯합니다.
    const onChangeSearch = (e)=>{
        setSearch(e.target.value)
    }
    const getFilterdData = () =>{
        if(search===""){
            return recipeList
        }
        return recipeList.filter((recipe=>recipe.recipeName.includes(search)))
    }
    const filteredRecipeList = getFilterdData()
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

    const handleRecommand = useCallback(() => {
        navigate(`/recipe/recommend/${userPk}`);
    },[navigate])
    const handleLike = useCallback(() => {
        navigate(`/recipe/liked/${userPk}`);
    },[navigate])
    return (
        <>
            <h1 className={style.title}>레시피 페이지</h1>
            <div className={style.recipewrapper}>
                <div className={style.actions}>
                    <input value={search} onChange={onChangeSearch} placeholder="검색" />
                    <button onClick={handleAdd}>레시피 추가</button>
                    <button onClick={handleRecommand}>맞춤 레시피 보기</button>
                    <button onClick={handleLike} >좋아요한 레시피 보기</button>
                </div>
                {filteredRecipeList.map((recipe) => (
                    <RecipeItem key={recipe.recipePk} recipe={recipe} />
                ))}
            </div>

        </>
    )
}
export default Recipe