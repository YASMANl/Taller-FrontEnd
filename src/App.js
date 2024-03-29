//IMPORT
import{BrowserRouter,Routes,Route} from 'react-router-dom';
import MascotasComponent from './Components/MascotasComponent.js';
import AdoptarMascotasComponent from './Components/AdoptarMascotasComponent.js';
import DetalleMascotasComponent from './Components/DetalleMascotasComponent.js';
import LoginComponent from './Components/loginComponent.js';

import './App.css';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<AdoptarMascotasComponent></AdoptarMascotasComponent>}></Route>

      <Route path='/crear' element={<MascotasComponent></MascotasComponent>}></Route>

      <Route path='/detalles/:id' element={<DetalleMascotasComponent></DetalleMascotasComponent>}></Route>

      <Route path='/login' element={<LoginComponent></LoginComponent>}></Route>

    </Routes>
    </BrowserRouter>
  );
}

//EXPORT
export default App;
