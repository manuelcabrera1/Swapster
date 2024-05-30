import './App.css'
import CrearUsuario from './crearusuario'
import MostrarUsuario from './mostrarusuarios'
import LoginPage from './iniciarSesion'
import HomePage from './paginaPrincipal'
import ProductPage from './productPage'
import SellProductPage from './venderProducto'
import UserProfile from './perfilUsuario'
import ModifyProfile from './modificarPerfil'
import ModifyProduct from './modificarProducto'
import Success from './success';
import Cancel from './cancel';
import Pasarela from './pasarela'

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
                    <Route path='/modificar-perfil' component={ModifyProfile}/>
                    <Route path='/modificar-producto/:productId' component={ModifyProduct}/>
                    <Route path='/success' component={Success}/>
                    <Route path='/cancel' component={Cancel}/>
                    <Route exact path='/' component={HomePage}/>
                    <Route path='/pasarela/:productId' component={Pasarela}/>
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default App;