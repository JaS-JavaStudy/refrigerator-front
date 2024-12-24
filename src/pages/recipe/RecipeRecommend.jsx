// RecipeRecommend.jsx
import { useEffect, useState } from "react";
import { getRecommendedRecipes } from "../../sources/api/recipeAPI";
import { API_URL_HOST } from "../../sources/api/recipeAPI";
import defaultImage from "../../assets/image/default.gif";
import '../../assets/css/recipe/RecipeRecommend.css'
import { useParams, useNavigate } from "react-router-dom";

function RecipeRecommend() {
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);
    const {userPk} = useParams();
    const navigate = useNavigate();

    const handleViewRecipe = (recipePk) => {
        navigate(`/recipe/${recipePk}`);
    };

    useEffect(() => {
        const fetchRecommendedRecipes = async () => {
            try {
                const data = await getRecommendedRecipes(userPk);
                console.log('추천 레시피 데이터:', data);
                setRecommendedRecipes(data);
            } catch (err) {
                console.error("레시피 추천 로드 실패:", err);
            }
        };

        fetchRecommendedRecipes();
    }, [userPk]);

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-center my-8" style={{color: '#3FA2F6'}}>
                맞춤 레시피 추천
            </h1>
            
            <div className="recipe-grid">
                {recommendedRecipes.map(recipe => (
                    <div key={recipe.recipePk} className="recipe-card">
                        <div className="image-container">
                            <img 
                                src={recipe.mainImages?.length > 0 
                                    ? recipe.mainImages[0].filePath
                                    : defaultImage}
                                alt={recipe.recipeName}
                                className="recipe-image"
                            />
                        </div>
                        
                        <div className="recipe-content">
                            <h3 className="recipe-title">{recipe.recipeName}</h3>
                            <p className="text-gray-600 mb-4">{recipe.recipeContent}</p>
                            
                            <div className="ingredients-section mb-4">
                                <h4 className="font-semibold mb-2">필요한 재료</h4>
                                <div className="ingredients-grid">
                                    {recipe.ingredients.map((ingredient, index) => (
                                        <span 
                                            key={index}
                                            className={`ingredient-tag ${ingredient.necessary ? 'necessary' : 'optional'}`}
                                        >
                                            {ingredient.ingredientName}
                                            {ingredient.necessary && 
                                                <span className="necessary-badge">필수</span>
                                            }
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="recipe-info">
                                <div className="flex justify-between">
                                    <span>조리 시간</span>
                                    <span>{recipe.recipeCookingTime}분</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span>재료 매칭률</span>
                                    <span className="match-rate">{recipe.matchRate.toFixed(1)}%</span>
                                </div>
                                
                                {recipe.remainExpirationDays <= 3 && (
                                    <div className="expiry-warning">
                                        ⚠️ {recipe.urgentIngredientName} 
                                         {recipe.remainExpirationDays} 일 남음
                                    </div>
                                )}
                            </div>
                            <button 
                                className="view-recipe-btn"
                                onClick={() => handleViewRecipe(recipe.recipePk)}
                            >
                                레시피 보기
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecipeRecommend;