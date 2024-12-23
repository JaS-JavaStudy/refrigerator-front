import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./pages/layouts/Layout"
import Ingredient from "./pages/ingredient/Ingregdient"
import Recipe from "./pages/recipe/Recipe"
import RecipeDetail from "./pages/recipe/RecipeDetail"
import {AddRecipe} from "./pages/recipe/AddRecipe"
import Join from "./pages/user/Join"
import Login from "./pages/user/Login"
import RecipeRecommend from "./pages/recipe/RecipeRecommend"
import {UpdateRecipe} from "./pages/recipe/UpdateRecipe.jsx"
import RecipeLiked from "./pages/recipe/RecipeLiked.jsx"
import Logout from "./components/user/Logout"
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute"
import RecipeRandom from "./pages/recipe/RecipeRandom"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="ingredient">
                        <Route index element={<Ingredient />} />
                        {/* <Route path=':ingredientMyRefrigeratorPk' element={<UsersIngredientItem/>} /> */}
                    </Route>
                    <Route path="recipe" >
                        <Route index element={<Recipe/>} />
                        <Route path='liked/:userPk' element={<RecipeLiked/>} />
                        <Route path='create' element={<AddRecipe/>} />
                        <Route path='recommend/:userPk' element={<RecipeRecommend/>} />
                        <Route path=':recipePk' element={<RecipeDetail/>}/>
                        <Route path=':recipePk/update' element={<UpdateRecipe/>} />
                        <Route path='random' element={<RecipeRandom/>}/>
                    </Route>
                    <Route path="join" element={<PublicOnlyRoute><Join/></PublicOnlyRoute>} />
                    <Route path="login" element={<PublicOnlyRoute><Login/></PublicOnlyRoute>} />
                    <Route path="logout" element={<Logout/>} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}
export default App