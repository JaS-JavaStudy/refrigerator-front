import {Outlet} from 'react-router-dom'
import Header from '../../components/main/Header'
import Footer from '../../components/main/Footer'

function Layout() {
    return(
        <div  className='mainContainer'>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    )
}

export default Layout