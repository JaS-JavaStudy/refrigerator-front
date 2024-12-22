import defaultRecipeImg from "../../assets/image/recipeimage.png"
import style from "../../assets/css/recipe/RecipeItem.module.css"
import { useNavigate } from "react-router-dom";
const RecipeItem = ({ recipe }) => {
    const navigate = useNavigate()
    const imgSrc = recipe.recipeSource.length!==0?recipe.recipeSource[0].recipeSourceSave:defaultRecipeImg
    const toRecipe = ()=>{
        navigate(`/recipe/${recipe.recipePk}`)
    }
    return (
        <div onClick={toRecipe} className={style.card}>
            <h3>{recipe.recipeName}</h3>
            <img src={`${imgSrc}`} alt="Recipe Image" style={{ width: '100px', height: 'auto' }} />
            <p>{recipe.recipeContent}</p>
            <p>조리시간:{recipe.recipeCookingTime}(단위)</p>
            <p>난이도:{recipe.recipeDifficulty}</p>
            <p>조회수:{recipe.recipeViews}</p>
        </div>
    );
};

export default RecipeItem