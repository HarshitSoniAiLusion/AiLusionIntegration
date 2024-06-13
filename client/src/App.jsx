import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import DataPrivacy from './Pages/DataPrivacy'
import VTON from './Pages/VTON'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/signin' element={<SignIn/>}/>
            <Route path='/privacy' element={<DataPrivacy/>}/>
            <Route path='/tryOn' element={<VTON/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
