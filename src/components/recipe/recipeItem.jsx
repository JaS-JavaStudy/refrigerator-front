import defaultRecipeImg from "../../assets/image/recipeimage.png"
import style from "../../assets/css/recipe/RecipeItem.module.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios'
import { getLikeStatus } from "../../sources/api/recipeAPI";

const RecipeItem = ({ recipe, userPk }) => {
    const navigate = useNavigate()
    const imgSrc = recipe.recipeSource.length !== 0 ? recipe.recipeSource[0].recipeSourceSave : defaultRecipeImg
    
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchstatus = async () => {
            try {
                const isliked = await getLikeStatus(userPk, recipe.recipePk);
                setLiked(isliked)
            } catch(err) {
                console.error(err)
            }
        }
        fetchstatus() 
    }, [])

    const handleToggleLike = async (e) => {
        e.stopPropagation()
        try {
            const response = await axios.post(`http://localhost:8080/recipe/reaction`, {
                recipePk: recipe.recipePk,
                userPk: userPk,
                likeStatus: !liked
            });
            setLiked(response.data.userReaction)
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    const toRecipe = () => {
        navigate(`/recipe/${recipe.recipePk}`)
    }

    return (
        <div onClick={toRecipe} className={style.recipeItem}>
            <img 
                src={imgSrc} 
                alt={recipe.recipeName} 
                className={style.recipeImage}
            />
            <div className={style.recipeContent}>
                <h3 className={style.recipeTitle}>{recipe.recipeName}</h3>
                <p className={style.recipeDescription}>{recipe.recipeContent}</p>
                <div className={style.recipeInfo}>
                    <span>조리시간: {recipe.recipeCookingTime}분</span>
                    <span>난이도: {recipe.recipeDifficulty}</span>
                    <span>조회수: {recipe.recipeViews}</span>
                </div>
                <button
                    onClick={handleToggleLike}
                    className={style.likeButton}
                >
                    {liked ? '⭐' : '☆'}
                </button>
            </div>
        </div>
    );
};

export default RecipeItem