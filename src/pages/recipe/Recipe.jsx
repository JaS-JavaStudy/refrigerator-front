import { useEffect, useState,useCallback } from "react"
import { getRecipeList } from "../../sources/api/recipeAPI.jsx";
import {Link, Route, useNavigate} from "react-router-dom";
import { AddRecipe} from "./AddRecipe.jsx";
import RecipeItem from "../../components/recipe/RecipeItem.jsx"
import style from "../../assets/css/recipe/recipe.module.css"


function Recipe() {
    const [recipeList, setRecipeList] = useState([])
    const [search, setSearch] = useState("")
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
    const onChangeSearch = (e)=>{
        setSearch(e.target.value)
    }
    const getFilterdData = () =>{
        if(search===""){
            return recipeList
        }
        return recipeList.filter((recipe=>recipe.recipeName.includes(search)))
    }
    const filteredRecipeList = getFilterdData()
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

    const handleRecommand = useCallback(() => {
        navigate(`/recipe/recommend/${userPk}`);
    },[navigate,userPk])
    const handleLike = useCallback(() => {
        navigate(`/recipe/liked/${userPk}`);
    },[navigate,userPk])
    
    return (
        <>
            <h1 className={style.title}>레시피 페이지</h1>
            <div className={style.recipewrapper}>
                <div className={style.actions}>
                    <input value={search} onChange={onChangeSearch} placeholder="검색" />
                    <button onClick={handleAdd}>레시피 추가</button>
                    <button onClick={handleRecommand}>맞춤 레시피 보기</button>
                    <button onClick={handleLike} >좋아요한 레시피 보기</button>
                </div>
                {filteredRecipeList.map((recipe) => (
                    <RecipeItem key={recipe.recipePk} recipe={recipe} userPk={userPk}/>
                ))}
            </div>
        </>
    );
}

export default Recipe