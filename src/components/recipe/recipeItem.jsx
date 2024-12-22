import defaultRecipeImg from "../../assets/image/recipeimage.png"
import style from "../../assets/css/recipe/RecipeItem.module.css"
const RecipeItem = ({ recipe }) => {
    const imgSrc = recipe.recipeSource.length!==0?recipe.recipeSource[0].recipeSourceSave:defaultRecipeImg
    return (
        <div className={style.card}>
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