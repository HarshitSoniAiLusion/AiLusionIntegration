import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import DataPrivacy from './Pages/DataPrivacy'
import PrivateRouteTryOn from './Components/PrivateRouteTryOn'
import PrivateRoutePrivacy from './Components/PrivateRoutePrivacy'
import Subscription from './Components/Subscription'
import Header from './Components/Header'
import TryOn from './Pages/TryOn'

function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/signin' element={<SignIn/>}/>
            <Route path='/subscribe' element={<Subscription/>}/>
            <Route element={<PrivateRoutePrivacy/>}>
                <Route path='/privacy' element={<DataPrivacy/>}/>
            </Route>
            <Route element={<PrivateRouteTryOn/>}>
                <Route path='/tryOn' element={<TryOn/>}/>
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
