import axios from "axios";

export const API_URL_HOST = "http://localhost:8080";

const prefix = `${API_URL_HOST}/recipe`;

export const getUserPk=()=> {
    try {

        const token = localStorage.getItem("token")
        const payload = token.split(".")[1]; // 토큰의 payload 부분
        const decoded = JSON.parse(atob(payload)); // Base64 디코딩 후 JSON 파싱
        return decoded.username; // username에 담긴 userPk 반환
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
}



export const getRecipeDetail = async (recipePk) => {
    const url = `${prefix}/${recipePk}`
    const res = await axios.get(url)
    return res.data
}

export const getRecipeList = async () => {
    const url = `${prefix}`;
    const res = await axios.get(url);
    return res.data;
}

export const createRecipe = async (recipe) => {
    const url = `${prefix}`;
    const res = await axios.post(url, recipe);
    return res.data;
}

export const deleteRecipe = async (recipePk) => {
    console.log(recipePk,"번 레시피 delete 함수 실행")
    const url = `${prefix}`;
    await axios.delete(url,{params:{recipePk}})
}

export const recipeCategory = async () => {
    const url = `${prefix}/category`;
    const res = await axios.get(url);
    return res.data;
}

export const getRecommendedRecipes = async (userPk) => {
    const url = `${prefix}/recommend?userPk=${userPk}`;
    const res = await axios.get(url);
    return res.data;
}


export const getLikedRecipes = async (userPk) => {
    const url = `${prefix}/liked?userPk=${userPk}`;
    const res = await axios.get(url);
    return res.data
}

export const updateRecipe = async (recipe) => {
    const url = `${prefix}`;
    const res = await axios.put(url,recipe);
    return res.data;
}

export const deleteRecipe = async (recipePk) => {
    const url = `${prefix}`;
    const res = await axios.delete(url, {params: {recipePk}});
}

export const getRandomRecipe = async () => {
    const url = `${prefix}/random`;
    const res = await axios.get(url);
    return res.data;
}

