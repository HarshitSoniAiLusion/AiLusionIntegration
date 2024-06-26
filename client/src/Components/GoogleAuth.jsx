import React from 'react';
import { AiFillGoogleCircle } from "react-icons/ai";
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInStart , signInFailure , signInSuccess } from '../redux/user/userSlice.js';

export default function GoogleAuth() {
  const navigate=useNavigate();
  const auth=getAuth(app);
  const dispatch=useDispatch();
  async function handleGoogleAuth() {
    const provider=new GoogleAuthProvider();
    provider.setCustomParameters({prompt:'select_account'});
    try{
        dispatch(signInStart());
        const resultFromGoogle=await signInWithPopup(auth,provider);
        const res=await fetch('/api/auth/google',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                name:resultFromGoogle.user.displayName,
                email:resultFromGoogle.user.email
            })
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
        return;
    }
  }
  return (
    <div className='p-2 hover:bg-white hover:text-black bg-orange-400 flex items-center justify-center mt-5 rounded-lg text-white font-semibold '>
        <button onClick={handleGoogleAuth} className='flex gap-1 items-center justify-center'><AiFillGoogleCircle className='text-xl'/> Continue with Google</button>
    </div>
  )
}
