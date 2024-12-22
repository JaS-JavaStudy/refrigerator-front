import { useParams } from 'react-router-dom'
import { useEffect, useState,useCallback } from "react"
import { getRecipeDetail } from "../../sources/api/recipeAPI.jsx";
import defaultRecipeImg from "../../assets/image/recipeimage.png"


function RecipeDetail() {
    const { recipePk } = useParams()
    const [recipeDetail, setRecipeDetail] = useState({})
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

    const recipeImage = 
        recipeDetail.recipeSource && recipeDetail.recipeSource.length > 0
            ? recipeDetail.recipeSource[0]
            : defaultRecipeImg;

    return (
        <>
        <h1>레시피 상세조회 페이지</h1>
        <div>
            <img src={recipeImage} alt="레시피 이미지" />
            <h3>이름:{recipeDetail.recipeName}</h3>
            <p>내용:{recipeDetail.recipeContent}</p>
            <p>조리시간:{recipeDetail.recipeCookingTime}(단위)</p>
            <p>난이도:{recipeDetail.recipeDifficulty}</p>
            <p>조회수:{recipeDetail.recipeViews}</p>
            <p>재료</p>
            {recipeDetail.ingredients && recipeDetail.ingredients.map(ingredient => (<p key={ingredient.ingredientPk}>{ingredient.ingredientName}</p>))}
            <p>요리과정</p>
            {recipeDetail.recipeStep && 
            recipeDetail.recipeStep.map((step, index) => (
                <div key={step.recipeStepOrder}>
                    <p>Step {index + 1}: {step.recipeStepContent}</p>
                    {step.recipeStepSource && (
                        <img
                            src={step.recipeStepSource}
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