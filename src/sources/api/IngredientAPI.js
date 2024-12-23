import axios from "axios";

const BASE_URL = "http://localhost:8080/ingredient";


function getUserPkFromToken(token) {
  try {
    const payload = token.split(".")[1]; // 토큰의 payload 부분
    const decoded = JSON.parse(atob(payload)); // Base64 디코딩 후 JSON 파싱
    return decoded.username; // username에 담긴 userPk 반환
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export async function getAllIngredients() {
  try {
    const response = await axios.get(`${BASE_URL}`); // 백엔드에 전체 재료 목록을 가져오는 API 필요
    return response.data;
  } catch (err) {
    console.error("전체 재료 목록 조회 중 에러 발생:", err);
    throw err;
  }
}

export async function addIngredientToMyRefrigerator(ingredientData) {
  const token = localStorage.getItem("token")
  const extractedUserPk = getUserPkFromToken(token);

  try {
    const response = await axios({
      url: `${BASE_URL}`,
      method: "post",
      params: {
        userPk: extractedUserPk, // 실제 로그인된 사용자 PK로 교체 필요
        ingredientManagementPk: ingredientData.ingredientManagementPk,
      },
      data: {
        ingredientAmount: ingredientData.amount,
        expirationDate: ingredientData.expirationDate,
        registrationDate: new Date().toISOString().split("T")[0],
      },
    });
    return response.data;
  } catch (err) {
    console.error("재료 추가 중 에러 발생:", err);
    throw err;
  }
}

export async function createIngredient(ingredientData) {
  const token = localStorage.getItem("token")
  const extractedUserPk = getUserPkFromToken(token);

  try {
    const response = await axios({
      url: `${BASE_URL}`,
      method: "post",
      params: {
        userPk: extractedUserPk,
        ingredientManagementPk: ingredientData.ingredientManagementPk,
      },
      data: {
        ingredientAmount: ingredientData.ingredientAmount,
        expirationDate: ingredientData.expirationDate,
        registrationDate: ingredientData.registrationDate,
      },
    });
    return response.data;
  } catch (err) {
    console.error("재료 추가 중 에러 발생:", err);
    throw err;
  }
}

// IngredientAPI.js에서 deleteIngredient 함수 수정
export async function deleteIngredient(
  ingredientMyRefrigeratorPk,
  deleteAmount
) {
  try {
    const response = await axios({
      url: `${BASE_URL}`,
      method: "delete",
      data: {
        ingredientMyRefrigeratorPk,
        deleteAmount,
      },
    });
    console.log("삭제 요청 데이터:", {
      ingredientMyRefrigeratorPk,
      deleteAmount,
    });
    console.log("삭제 응답:", response);
    return response.data;
  } catch (err) {
    console.error("삭제 요청 중 에러 발생:", err);
    throw err;
  }
}

export async function getUsersIngredient() {
  const token = localStorage.getItem("token")
  const extractedUserPk = getUserPkFromToken(token);
  try {
    const response = await axios({
      url: `${BASE_URL}`,
      method: "get",
      params: {
        userPk: extractedUserPk,
      },
    });
    return response.data; // 데이터를 반환
  } catch (err) {
    console.error(err);
    throw err; // 호출자에게 에러 전달
  }
}

export function updateIngredientBookmark(userPk, isBookmarked, ingredient) {
  const token = localStorage.getItem("token")
  const extractedUserPk = getUserPkFromToken(token);
  if (!isBookmarked) {
    axios({
      url: `${BASE_URL}/bookmark/regist`,
      method: "post",
      data: {
        userPk: extractedUserPk,
        ingredientMyRefrigeratorPk: ingredient.ingredientMyRefrigeratorPk,
      },
    })
      .then((res) => {
        console.log(res);
        console.log("추가됨");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    axios({
      url: `${BASE_URL}/bookmark/delete`,
      method: "delete",
      data: {
        userPk: extractedUserPk,
        ingredientBookmarkPk: ingredient.ingredientBookmarkPk,
      },
    })
      .then((res) => {
        console.log(res);
        console.log("삭제됨");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
