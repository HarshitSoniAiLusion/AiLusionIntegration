import React, { useState } from 'react'
import {useNavigate , Link} from 'react-router-dom'
import GoogleAuth from '../Components/GoogleAuth';
import { useSelector , useDispatch } from 'react-redux';
import { signUpStart , signUpFailure , signUpSuccess } from '../redux/user/userSlice';

export default function SignUp() {
  const [user,setUser]=useState({});
  const {loading,error}=useSelector(state=>state.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  function handleInput(e) {
    setUser({...user,[e.target.id]:e.target.value});
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!user.username || !user.password || !user.email || user.username===''||user.password===''||user.email===''){
      dispatch(signUpFailure('All fields are Required to Fill'));
      return;
    }
    try{
        dispatch(signUpStart());
        const res=await fetch('/api/auth/signup',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(user)
        });
        const data=await res.json();
        if(!res.ok){
          dispatch(signUpFailure(data.message));
          return;
        }
        dispatch(signUpSuccess(data));
        navigate('/privacy');
    } 
    catch(err){
      dispatch(signUpFailure(err.message));
    }
  }
  console.log(user);
  return (
    <div className='w-full min-h-screen flex flex-col gap-4 items-center justify-center'>
      {error && <p className='text-red-600 font-semibold bg-red-300 w-1/2 p-3 rounded-lg'>{error}</p>}
      <h1 className='text-center text-xl font-bold'>Sign Up</h1>
        <div className=" rounded-xl bg-fuchsia-900 p-10">
          <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-4'>
            <input 
              type="text" 
              className=' w-80 rounded-md p-2 outline-none'
              placeholder='Enter Username'
              id='username'
              onChange={handleInput}
            />
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
            <button type='submit' className='w-full hover:bg-white hover:text-black font-semibold text-white px-4 py-2 rounded-md bg-green-600'>Sign Up</button>
          </form>
          <GoogleAuth/>
          <p className='text-white font-semibold text-center mt-5'>Have already the account ? <Link className='text-blue-500 hover:underline' to={'/signin'}>Sign in</Link></p>
        </div>
    </div>
  )
}
