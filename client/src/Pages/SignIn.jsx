import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'

export default function SignUp() {
  const [user,setUser]=useState({});
  const [error,setError]=useState();
  const navigate=useNavigate();
  function handleInput(e) {
    setUser({...user,[e.target.id]:e.target.value});
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError(null);
    if(!user.password || !user.email || user.email==='' || user.password===''){
      setError('All fields are required to fill');
      return;
    }
    try{
      const res=await fetch('/api/auth/signin',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(user)
      });
      const data=await res.json();
      if(!res.ok){
        setError(data.message);
        return;
      }
      navigate('/privacy');
    }  
    catch(err){
      console.log(err);
    }
  }
  console.log(user);
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
            <button type='submit' className='text-white px-4 py-2 rounded-md bg-green-600'>Sign In</button>
          </form>
        </div>
    </div>
  )
}
