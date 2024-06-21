import React from 'react'
import {useSelector} from 'react-redux';
import {Outlet,Navigate} from 'react-router-dom'

export default function PrivateRoute() {
    const {currUser}=useSelector(state=>state.user);
  return (
    <> 
       {currUser?currUser.isPrivacyChecked?<Outlet/>:<Navigate to={'/privacy'}/>:<Navigate to={'/signin'}/>}
    </>
  )
}
