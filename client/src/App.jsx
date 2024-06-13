import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import DataPrivacy from './Pages/DataPrivacy'
import VTON from './Pages/VTON'
import PrivateRouteTryOn from './Components/PrivateRouteTryOn'
import PrivateRoutePrivacy from './Components/PrivateRoutePrivacy'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/signin' element={<SignIn/>}/>
            <Route element={<PrivateRoutePrivacy/>}>
                <Route path='/privacy' element={<DataPrivacy/>}/>
            </Route>
            <Route element={<PrivateRouteTryOn/>}>
                <Route path='/tryOn' element={<VTON/>}/>
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
