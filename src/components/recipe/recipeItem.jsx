import defaultRecipeImg from "../../assets/image/recipeimage.png"
import style from "../../assets/css/recipe/RecipeItem.module.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios'
import { getLikeStatus } from "../../sources/api/recipeAPI";
const RecipeItem = ({ recipe,userPk }) => {
    const navigate = useNavigate()

    const imgSrc = recipe.recipeSource.length!==0?recipe.recipeSource[0].recipeSourceSave:defaultRecipeImg
    const toRecipe = ()=>{
        navigate(`/recipe/${recipe.recipePk}`)
    }
    const [liked, setLiked] = useState(false); // 초기 좋아요 상태
    useEffect(()=>{
        const fetchstatus = async () => {
            try{
                const isliked = await getLikeStatus(userPk,recipe.recipePk);
                console.log("userPk",userPk,"recipePk",recipe.recipePk,"likestatus",isliked)
                setLiked(isliked)
            } catch(err) {
                console.error(err)
            }
        }
        fetchstatus() 
    },[])
    const handleToggleLike = async (e) => {
        e.stopPropagation()
        try {
            const response = await axios.post(`http://localhost:8080/recipe/reaction`, {
                recipePk:recipe.recipePk,
                userPk:userPk,
                likeStatus:!liked
            });
            console.log(response.data)
            setLiked(response.data.userReaction)
        } catch (error) {
        console.error("Failed to toggle like:", error);
        }
    };
    return (
        <div onClick={toRecipe} className={style.card}>
            <h3>{recipe.recipeName}</h3>
            <img src={`${imgSrc}`} alt="Recipe Image" style={{ width: '100px', height: 'auto' }} />
            <p className={style.content}>{recipe.recipeContent}</p>
            <p>조리시간:{recipe.recipeCookingTime}분</p>
            <p>난이도:{recipe.recipeDifficulty}</p>
            <p>조회수:{recipe.recipeViews}</p>
            <button
                onClick={handleToggleLike}
                style={{
                    border: "none",
                    cursor: "pointer",
                }}
            >
                {liked ? '⭐' : '☆'}
            </button>
        </div>
    );
};

export default RecipeItem