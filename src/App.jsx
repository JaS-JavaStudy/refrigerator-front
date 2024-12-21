import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./pages/layouts/Layout"
import Ingredient from "./pages/ingredient/Ingregdient"
import Recipe from "./pages/recipe/Recipe"
import {AddRecipe} from "./pages/recipe/AddRecipe"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route path="ingredient">
                        <Route index element={<Ingredient/>}/>
                        {/* <Route path=':ingredientMyRefrigeratorPk' element={<UsersIngredientItem/>} /> */}
                    </Route>
                    <Route path="recipe" >
                        <Route index element={<Recipe/>} />
                        <Route path='create' element={<AddRecipe/>} />
                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    )
}
export default App