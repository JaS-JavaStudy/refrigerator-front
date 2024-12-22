import { useEffect, useState,useCallback } from "react"
import { getRecipeList } from "../../sources/api/recipeAPI.jsx";
import {Link, Route, useNavigate} from "react-router-dom";
import { AddRecipe} from "./addRecipe.jsx";
import RecipeItem from "../../components/recipe/RecipeItem.jsx"
import "../../assets/css/recipe/recipe.css"


function Recipe() {
    const [recipeList, setRecipeList] = useState([]);
    const navigate = useNavigate();
    const [userPk, setUserPk] = useState(null);

    useEffect(() => {
        // token에서 userPk 추출
        const checkLogin = () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('로그인이 필요한 서비스입니다.');
                navigate('/login');
                return;
            }

            try {
                const payload = token.split(".")[1];
                const decoded = JSON.parse(atob(payload));
                const extractedUserPk = decoded.username; 
                
                if (!extractedUserPk) {
                    alert('사용자 정보를 찾을 수 없습니다.');
                    navigate('/login');
                    return;
                }

                setUserPk(extractedUserPk);
            } catch (error) {
                console.error("Failed to decode token:", error);
                alert('로그인 정보가 유효하지 않습니다.');
                navigate('/login');
            }
        };

        checkLogin();
    }, [navigate]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getRecipeList();
                console.log("recipeList", data);
                setRecipeList(data);
            } catch (err) {
                console.error(err);
            }
        };

        if (userPk) {  // userPk가 있을 때만 레시피 목록 가져오기
            fetchRecipes();
        }
    }, [userPk]);  // userPk가 변경될 때마다 실행

    const handleAdd = useCallback(() => {
        if (!userPk) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }
        navigate("/recipe/create");
    }, [navigate, userPk]);

    return (
        <>
            <h1>레시피 페이지</h1>
            <div>
                <button onClick={handleAdd}>레시피 추가</button>
                {userPk && (
                    <Link 
                        to={`/recipe/recommend/${userPk}`}
                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        맞춤 레시피 보기
                    </Link>
                )}
            </div>
            <div className="recipe-wrapper">
                {recipeList.map((recipe) => (
                    <RecipeItem key={recipe.recipePk} recipe={recipe} />
                ))}
            </div>
        </>
    );
}

export default Recipe