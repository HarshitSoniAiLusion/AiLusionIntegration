import React, { useState } from 'react'
import { useSelector , useDispatch } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import {updateSubscriptionFailure,updateSubscriptionSuccess,updateSubscriptionStart} from '../redux/user/userSlice.js'
export default function Subscription() {
    const {currUser}=useSelector(state=>state.user);
    const [updated,setUpdated]=useState(null);
    const dispatch=useDispatch();
    async function handleSubscribed(trial) {
        try {
            dispatch(updateSubscriptionStart());
            const res=await fetch(`/api/user/subscribe/${currUser._id}`,{
                method:'PATCH',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({trial})
            });
            const data=await res.json();
            if(!res.ok){
                dispatch(updateSubscriptionFailure(data.message))
                return;
            }
            dispatch(updateSubscriptionSuccess(data));
            setUpdated(`Your Trials now increase by ${trial}`);
            return;
        } catch (err) {
            dispatch(updateSubscriptionFailure(err.message));
        }
    }
  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen">
        {updated && <p className=' bg-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center justify-between'>{updated} <RxCross2 className='font-bold text-xl ml-5 cursor-pointer' onClick={()=>setUpdated(null)}/></p>}
        <div className="flex flex-col border-2 border-black w-80 h-72 p-5 rounded-xl gap-4">
            <h2 className='text-center font-semibold'>Subscribed</h2>
            <div className="border-2 bg-green-200 border-black w-full p-2 rounded-lg flex items-center justify-between">
                <h3 className=' font-semibold'>Get 10 Trials</h3>
                <button 
                    className='px-4 py-2 bg-green-500 rounded-lg'
                    onClick={()=>handleSubscribed(10)}
                >30&#8377;</button>
            </div>
            <div className="border-2 bg-green-200 border-black w-full p-2 rounded-lg flex items-center justify-between">
                <h3 className=' font-semibold'>Get 20 Trials</h3>
                <button 
                    className='px-4 py-2 bg-green-500 rounded-lg'
                    onClick={()=>handleSubscribed(20)}
                >50&#8377;</button>
            </div>
            <div className="border-2 bg-green-200 border-black w-full p-2 rounded-lg flex items-center justify-between">
                <h3 className=' font-semibold'>Get 50 Trials</h3>
                <button 
                    className='px-4 py-2 bg-green-500 rounded-lg'
                    onClick={()=>handleSubscribed(50)}
                >100&#8377;</button>
            </div>
            
        </div>
    </div>
  )
}
