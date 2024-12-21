import axios from "axios";

const BASE_URL = 'http://localhost:8080/ingredient'

export async function getUsersIngredient() {
    try {
        const response = await axios({
            url: `${BASE_URL}`,
            method: 'get',
            params: {
                userPk: 1,
            },
        });
        return response.data; // 데이터를 반환
    } catch (err) {
        console.error(err);
        throw err; // 호출자에게 에러 전달
    }
}

export function updateIngredientBookmark(userPk, isBookmarked, ingredient) {
    if (!isBookmarked) {
        axios({
            url: `${BASE_URL}/bookmark/regist`,
            method: 'post',
            data: {
                userPk: userPk,
                ingredientMyRefrigeratorPk: ingredient.ingredientMyRefrigeratorPk
            }
        })
        .then((res) => {
            console.log(res);
            console.log("추가됨");
        })
        .catch((err) => {
            console.log(err);
        })
    } else {
        axios({
            url: `${BASE_URL}/bookmark/delete`,
            method: 'delete',
            data: {
                userPk: userPk,
                ingredientBookmarkPk: ingredient.ingredientBookmarkPk
            }
        })
        .then((res) => {
            console.log(res);
            console.log("삭제됨");
        })
        .catch((err) => {
            console.log(err);
        })
    }
}