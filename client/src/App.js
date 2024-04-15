import './App.css'
import CrearUsuario from './crearusuario'
import MostrarUsuario from './mostrarusuarios'

import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App(){
    return(
        <BrowserRouter>
        <div>

        <Switch>
            <Route exact path='/' component={CrearUsuario }/>
            <Route path='/mostrar' component={MostrarUsuario }/>
        </Switch>
        </div>
        </BrowserRouter>
    )
}

export default App;