import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import {useSelector , useDispatch} from 'react-redux'
import { CheckPrivacyStart, CheckPrivacySuccess , CheckPrivacyFailure } from '../redux/user/userSlice';

export default function DataPrivacy() {
  const [check,setCheck]=useState(false);
  const {currUser}=useSelector(state=>state.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  useEffect(()=>{
    if(currUser.isPrivacyChecked){
      navigate('/tryOn');
    }
  },[])
  const handlePrivacy=async()=>{
    if(!currUser || currUser==null)navigate('/signin');
    if(!check){
      navigate('/');
    }else{
      try{
        console.log(check);
        dispatch(CheckPrivacyStart());
        const res=await fetch(`/api/user/setUserPrivacy/${currUser._id}`,{
          method:'PUT',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({check})
        });
        const data=await res.json();
        if(!res.ok){
          dispatch(CheckPrivacyFailure(data.message));
        }
        console.log(data);
        dispatch(CheckPrivacySuccess(data));
        navigate('/tryOn');
      }
      catch(err){
          dispatch(CheckPrivacyFailure(err.message));
          return;
      }
    }
  }
  return (
    <div className='max-w-2xl mx-auto flex flex-col gap-8'>
      <h2 className='text-xl font-semibold text-center mt-10'>Terms and Conditons</h2>
      <div className="">
        <p className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur eligendi tempore id placeat eos    deleniti itaque sit nobis, perspiciatis porro sunt dignissimos officiis delectus ipsum dolore dicta vitae  optio quibusdam.</p>
      </div>
      <div className=" flex gap-4 items-center">
        <p className=''>I agree to the Terms and Condition</p>
        <input onChange={()=>setCheck(!check)} className='h-4 w-4' type="checkbox" id="isPrivacyChecked" />
      </div>
      <button onClick={handlePrivacy} className='px-4 py-2 text-white font-semibold border-2 border-green-400 bg-green-400 rounded-lg hover:text-black hover:bg-white'>Next</button>
    </div>
  )
}
