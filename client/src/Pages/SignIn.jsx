import React, { useState } from 'react'
import {useNavigate , Link} from 'react-router-dom'
import GoogleAuth from '../Components/GoogleAuth';
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function SignUp() {
  const [user,setUser]=useState({});
  const {loading,error}=useSelector(state=>state.user);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  function handleInput(e) {
    setUser({...user,[e.target.id]:e.target.value});
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!user.password || !user.email || user.email==='' || user.password===''){
      dispatch(signInFailure('All fields are required to fill'))
      return;
    }
    try{
      dispatch(signInStart());
      const res=await fetch('/api/auth/signin',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(user)
      });
      const data=await res.json();
      if(!res.ok){
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/privacy');
    }  
    catch(err){
      dispatch(signInFailure(err.message));
    }
  }
  return (
    <div className='w-full min-h-screen flex flex-col gap-4 items-center justify-center'>
      {error && <p className='text-red-600 font-semibold bg-red-300 w-1/2 p-3 rounded-lg'>{error}</p>}
      <h1 className='text-center text-xl font-bold'>Sign In</h1>
        <div className=" rounded-xl bg-fuchsia-900 p-10">
          <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-4'>
            <input 
              type="email" 
              className=' w-80 rounded-md p-2 outline-none'
              placeholder='Enter Email'
              id='email'
              onChange={handleInput}
            />
            <input 
              type="password" 
              className=' w-80 rounded-md p-2 outline-none'
              placeholder='Enter Password'
              id='password'
              onChange={handleInput}
            />
            <button type='submit' className='w-full hover:bg-white hover:text-black font-semibold text-white px-4 py-2 rounded-md bg-green-600'>Sign In</button>
          </form>
          <GoogleAuth/>
          <p className='text-white font-semibold text-center mt-5'>Not have the account ? <Link className='text-blue-500 hover:underline' to={'/signup'}>Sign Up</Link></p>
        </div>
    </div>
  )
}
