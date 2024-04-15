import './App.css'
import CrearUsuario from './usuarios/crearusuario'
import MostrarUsuario from './usuarios/mostrarusuarios'

import {Routes, Route} from 'react-router-dom'

function App(){
    return(
        <div className="container">

        <Routes>
            <Route path='/' element={<CrearUsuario />}/>
            <Route path='/mostrar' element={<MostrarUsuario />}/>
        </Routes>
        </div>
    )
}

export default App;