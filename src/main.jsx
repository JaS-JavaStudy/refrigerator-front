import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/css/main.module.css'
import style from './assets/css/main.module.css'


createRoot(document.getElementById('root')).render(
  <div className={style.mainContainer}>
    <App />
  </div>
)
