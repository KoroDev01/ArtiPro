
import { Routes, Route } from 'react-router-dom'
import Acceuil from './assets/Pages/Accuill.jsx'
import Artisant from './assets/Pages/Artisants.jsx'
import './App.css'

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/' element={<Acceuil />} />
        <Route path='/find-artisan' element={<Artisant />} />
      </Routes>
    </>
  );
}

export default App
