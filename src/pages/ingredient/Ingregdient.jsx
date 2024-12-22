// Ingredient.jsx
import UsersIngredient from "../../components/ingredient/userIngredient/UsersIngredient"
import SearchIngredient from "../../components/ingredient/searchIngredient/SearchIngredient";
import style from '../../assets/css/ingredient/ingredient/Ingredient.module.css'

function Ingredient() {
    return (
        <main className={style.mainLayout}>
            <div className={style.searchSection}>
                <SearchIngredient />
            </div>
            <div className={style.refrigeratorSection}>
                <UsersIngredient />
            </div>
        </main>
    )
}

export default Ingredient