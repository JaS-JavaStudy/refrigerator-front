import recipeImage from "../../assets/image/recipeimage.png"

const RecipeItem = ({ recipe }) => {
    return (
        <div >
            <img src={recipeImage} alt="Default Recipe Image" style={{ width: '100px', height: 'auto' }} />
            <p>사진:{recipe.recipeSource}</p>
            <h3>이름:{recipe.recipeName}</h3>
            <p>내용:{recipe.recipeContent}</p>
            <p>조리시간:{recipe.recipeCookingTime}(단위)</p>
            <p>난이도:{recipe.recipeDifficulty}</p>
            <p>조회수:{recipe.recipeViews}</p>
        </div>
    );
};

export default RecipeItem