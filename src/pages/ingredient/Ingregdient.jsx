import UsersIngredient from "../../components/ingredient/userIngredient/UsersIngredient"
import style from '../../assets/css/ingredient/ingredient/Ingredient.module.css'


function Ingredient() {
    console.log(style);
    return (
        <>
            <h1>재료 페이지</h1>
            <div className={style.userIngredient}>
                <UsersIngredient />
            </div>
        </>
    )
}

export default Ingredient