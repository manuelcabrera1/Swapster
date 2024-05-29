import './App.css'
import CrearUsuario from './crearusuario'
import MostrarUsuario from './mostrarusuarios'
import LoginPage from './iniciarSesion'
import HomePage from './paginaPrincipal'
import ProductPage from './productPage'
import SellProductPage from './venderProducto'
import UserProfile from './perfilUsuario'

import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App(){
    return(
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path='/registro' component={CrearUsuario}/>
                    <Route path='/mostrar' component={MostrarUsuario}/>
                    <Route path='/login' component={LoginPage}/>
                    <Route path='/product/:id' component={ProductPage}/>
                    <Route path="/vender" component={SellProductPage} />
                    <Route path='/perfil' component={UserProfile}/>
                    <Route exact path='/' component={HomePage}/>
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default App;