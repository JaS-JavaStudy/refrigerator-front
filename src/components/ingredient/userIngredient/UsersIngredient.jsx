import { useEffect, useState } from "react"
import { getUsersIngredient } from "../../../sources/api/IngredientAPI"
import UsersIngredientItem from "./UsersIngredientItem"
import style from '../../../assets/css/Ingredient/userIngredient/UsersIngredient.module.css'

function UserIngredient() {
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

    return(
        <div className={style.container}>
            <h1>내 냉장고</h1>
            <div className={style.cardContainer}>
            {usersIngredientList.map(ingredient =>
                <UsersIngredientItem key=
                    {ingredient.ingredientMyRefrigeratorPk} userIngredient={ingredient} />
            )}
            </div>
        </div>
    )
}

export default UserIngredient