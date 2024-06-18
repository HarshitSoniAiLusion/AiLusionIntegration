import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logOutSuccess } from '../redux/user/userSlice';

export default function Header() {
    const {currUser}=useSelector(state=>state.user);
    const dispatch=useDispatch();
    const handleLogOut=async()=>{
        try {
            const res=await fetch('/api/user/signOut',{method:'POST'});
            const data=await res.json();
            if(!res.ok){
                console.log(data.message);
            }
            console.log(data);
            dispatch(logOutSuccess());
            return;
        } catch (err) {
            console.log(err);
        }
    }
  return (
    <div className='w-full flex items-center justify-end pr-10 py-3'>
        {currUser && <button onClick={handleLogOut} className='py-2 px-4 font-semibold bg-green-400 rounded-lg border-2 border-green-500 hover:bg-white'>Log out</button>}
    </div>
  )
}
