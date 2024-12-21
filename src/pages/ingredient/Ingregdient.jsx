import { useEffect, useState } from "react"
import { getUsersIngredient } from "../../sources/api/IngredientAPI"
import UsersIngredientItem from "../../components/ingredient/UsersIngredientItem";

function Ingredient() {
    const [usersIngredientList, setUserIngredientList] = useState([])

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const data = await getUsersIngredient();
                setUserIngredientList(data); // 상태 업데이트
                console.log(usersIngredientList); // 가져온 데이터 확인
            } catch (err) {
                console.error(err);
            }
        };

        fetchIngredients(); // 비동기 작업 호출
    }, []);

    return (
        <>
            <h1>재료 페이지</h1>

            {usersIngredientList.map(ingredient =>
                <UsersIngredientItem key=
                    {ingredient.ingredientMyRefrigeratorPk} userIngredient={ingredient} />
            )}
        </>
    )
}

export default Ingredient