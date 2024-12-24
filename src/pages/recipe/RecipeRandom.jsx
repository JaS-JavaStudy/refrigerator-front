import React, { useState } from 'react';
import { getRandomRecipe } from '@/sources/api/recipeAPI';
import defaultImage from "@/assets/image/default.gif";
import '@/assets/css/recipe/RecipeRandom.css';
import { useNavigate } from 'react-router-dom';

function RecipeRandom() {
    const navigate = useNavigate();
   const [recipe, setRecipe] = useState(null);
   const [isDrawing, setIsDrawing] = useState(false);
   const [showBox, setShowBox] = useState(true);
   const [isOpening, setIsOpening] = useState(false);

   const drawRecipe = async () => {
       if (isDrawing) return;
       
       setIsDrawing(true);
       setIsOpening(true);

       try {
           setTimeout(async () => {
               const data = await getRandomRecipe();
               console.log('받아온 레시피 데이터:', data);
               setRecipe(data);
               setShowBox(false);
               setIsDrawing(false);
           }, 2500);
       } catch (err) {
           console.error("랜덤 레시피 로드 실패:", err);
           setIsDrawing(false);
       }
   };

   const resetDrawing = () => {
       setShowBox(true);
       setIsOpening(false);
       setRecipe(null);
   };

   const handleViewRecipe = () => {
    navigate(`/recipe/${recipe.recipePk}`);
};

   return (
       <div className="random-recipe-container">
           <h1 className="page-title">오늘의 레시피 뽑기</h1>
           
           <div className="draw-section">
               {showBox ? (
                   <div className={`mystery-box ${isOpening ? 'opening' : ''}`}>
                       <svg 
                           viewBox="0 0 200 200" 
                           className="box-svg"
                           style={{width: '200px', height: '200px'}}
                       >
                           {/* 상자 뚜껑 */}
                           <g className="box-lid">
                               <rect 
                                   x="40" 
                                   y="40" 
                                   width="120" 
                                   height="20" 
                                   fill="#3FA2F6" 
                                   rx="5"
                               />
                               <rect 
                                   x="80" 
                                   y="35" 
                                   width="40" 
                                   height="10" 
                                   fill="#96C9F4" 
                                   rx="3"
                               />
                           </g>
                           
                           {/* 상자 본체 */}
                           <g className="box-body">
                               <rect 
                                   x="40" 
                                   y="60" 
                                   width="120" 
                                   height="100" 
                                   fill="#3FA2F6" 
                                   rx="5"
                               />
                               {/* 상자 무늬 */}
                               <rect 
                                   x="50" 
                                   y="75" 
                                   width="100" 
                                   height="70" 
                                   fill="#96C9F4" 
                                   rx="3"
                               />
                               <circle 
                                   cx="100" 
                                   cy="110" 
                                   r="20" 
                                   fill="#ffffff" 
                                   opacity="0.3"
                               />
                           </g>
                       </svg>
                       
                       <button 
                           onClick={drawRecipe}
                           disabled={isDrawing}
                           className="draw-button"
                       >
                           {isDrawing ? '오픈!' : '레시피 뽑기'}
                       </button>
                   </div>
               ) : recipe && (
                   <div className="recipe-reveal">
                       <div className="recipe-card">
                       <div className="recipe-image-container">
                            <img 
                            src={recipe.mainImages?.length > 0 
                                ? recipe.mainImages[0].filePath
                                : defaultImage}
                            alt={recipe.recipeName}
                            className="recipe-image"
                            />
                        </div>
                           
                        <div className="recipe-details">
                            <h2 className="recipe-title">{recipe.recipeName}</h2>
                            <p className="recipe-description">{recipe.recipeContent}</p>
                            
                            <div className="recipe-info">
                                <div className="info-item">
                                    <span className="label">조리 시간</span>
                                    <span className="value"> {recipe.recipeCookingTime}분</span>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button 
                                    className="view-recipe"
                                    onClick={() => navigate(`/recipe/${recipe.recipePk}`)}
                                >
                                    레시피 보기
                                </button>
                                <button 
                                    className="draw-again"
                                    onClick={resetDrawing}
                                >
                                    다시 뽑기
                                </button>
                            </div>
                        </div>
                       </div>
                   </div>
               )}
           </div>
       </div>
   );
}

export default RecipeRandom;