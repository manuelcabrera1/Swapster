import './App.css'
import CrearUsuario from './crearusuario'
import MostrarUsuario from './mostrarusuarios'
import LoginPage from './iniciarSesion'

import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App(){
    return(
        <BrowserRouter>
        <div>

        <Switch>
            <Route exact path='/registro' component={CrearUsuario }/>
            <Route path='/mostrar' component={MostrarUsuario }/>
            <Route path='/login' component={LoginPage }/>
        </Switch>
        </div>
        </BrowserRouter>
    )
}

export default App;