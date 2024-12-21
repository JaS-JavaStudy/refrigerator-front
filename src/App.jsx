import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./pages/layouts/Layout"
import Ingredient from "./pages/ingredient/Ingregdient"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="ingredient">
            <Route index element={<Ingredient/>}/>
            {/* <Route path=':ingredientMyRefrigeratorPk' element={<UsersIngredientItem/>} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
