import { useParams,useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react'
import { getLikedRecipes } from '@/sources/api/recipeAPI';
import RecipeItem from '@/components/recipe/recipeItem';
import style from "@/assets/css/recipe/Recipe.module.css"
function RecipeLiked() {
    const { userPk } = useParams()
    const [likedRecipeList, setLikedRecipeList] = useState([])
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getLikedRecipes(userPk);

                console.log("LikedRecipeList",data); // 가져온 데이터 확인
                setLikedRecipeList(data); // 상태 업데이트
            } catch (err) {
                console.error(err);
            }
        };
        fetchRecipes(); // 비동기 작업 호출
    }, []);
    return(
        <>
        <h1 className={style.title}>좋아요한 레시피 페이지</h1>
        <div className={style.recipewrapper}>
            {likedRecipeList.map((recipe) => (
                <RecipeItem key={recipe.recipePk} recipe={recipe} />
            ))}
        </div>
        </>
    )
}
export default RecipeLiked