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