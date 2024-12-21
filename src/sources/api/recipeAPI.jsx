import axios from "axios";

export const API_URL_HOST = "http://localhost:8080";

const prefix = `${API_URL_HOST}/recipe`;

export const getRecipeList = async () => {
    const url = `${prefix}`;
    const res = await axios.get(url);
    return res.data;
}

export const createRecipe = async (recipe) => {
    console.log(recipe);
    const url = `${prefix}`;
    const res = await axios.post(url, recipe);
    return res.data;
}