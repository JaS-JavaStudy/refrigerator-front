import { useParams,useNavigate } from 'react-router-dom'
import { useEffect, useState,useCallback } from "react"
import { getRecipeDetail,deleteRecipe } from "../../sources/api/recipeAPI.jsx";
import defaultRecipeImg from "../../assets/image/recipeimage.png"
import style from "../../assets/css/recipe/RecipeDetail.module.css"

function RecipeDetail() {
    const { recipePk } = useParams()
    const [recipeDetail, setRecipeDetail] = useState({})
    const navigate = useNavigate();
    const toUpdate = useCallback(() => {
        navigate(`/recipe/${recipePk}/update`);
    },[navigate])
    const toDelete = useCallback(() => {
        const handleDelete = async () => {
            try {
                await deleteRecipe(recipePk);
                navigate("/recipe");
            } catch (err) {
                console.error(err);
            }
        };
        handleDelete(); // 비동기 함수 호출
    }, [recipePk, navigate]);
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getRecipeDetail(recipePk);
                console.log("recipeDetail",data); 
                setRecipeDetail(data); 
            } catch (err) {
                console.error(err);
            }
        };
        fetchRecipes();
    }, [recipePk]);

    const imgSrc = 
        recipeDetail.recipeSource && recipeDetail.recipeSource.length > 0
            ? recipeDetail.recipeSource[0]?.recipeSourceSave
            : defaultRecipeImg;

    return (
        <>
        <div className={style.imgdivcontainer}>
            <div className={style.imgdiv}>
                <h1>{recipeDetail.recipeName}</h1>
                <img src={`${imgSrc}`} alt="Recipe Image"/>
            </div>
            <div className={style.information}>
                <div>
                    <button>좋아요</button>
                    <button onClick={toUpdate}>수정</button>
                    <button onClick={toDelete}>삭제</button>
                </div>
                <p>내용 {recipeDetail.recipeContent}</p>
                <p>조리시간 {recipeDetail.recipeCookingTime}분</p>
                <p>난이도 {recipeDetail.recipeDifficulty}</p>
                <p>조회수 {recipeDetail.recipeViews}</p>
                <p>재료</p>
                {recipeDetail.ingredients && recipeDetail.ingredients.map(ingredient => (<p key={ingredient.ingredientPk}>{ingredient.ingredientName}</p>))}
            </div>
        </div>
        <div className={style.container}>
            <h2>요리과정</h2>
            {recipeDetail.recipeStep && 
            recipeDetail.recipeStep.map((step, index) => (
                <div key={step?.recipeStepOrder}>
                    <p>Step {index + 1}: {step.recipeStepContent}</p>
                    {step.recipeStepSource && (
                        <img
                            src={step.recipeStepSource.recipeStepSourceSave}
                            alt={`Step ${index + 1}`}
                        />
                    )}
                </div>
            ))}
        </div>
        </>
    )
}

export default RecipeDetail