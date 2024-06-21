import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

export default function Home() {
  const navigate=useNavigate();
  const {currUser}=useSelector(state=>state.user);
  const handleClick=()=>{
    if(!currUser || currUser===null)navigate('/signin');
    else if(!currUser.isPrivacyChecked) {
      navigate('/privacy')
    }else{
      navigate('/tryOn');
    }
  }
  return (
    <div className="w-full min-h-screen flex items-center gap-5 justify-center">
      <button 
        className='px-4 py-2 border-2 border-fuchsia-900 bg-fuchsia-900 text-white rounded-md hover:bg-white hover:text-black'
        onClick={handleClick}
      >Try on</button>
      <button
        className='px-4 py-2 border-2 border-fuchsia-900 bg-fuchsia-900 text-white rounded-md hover:bg-white hover:text-black'
        onClick={()=>navigate('/subscribe')}
      >Take Subscription</button>
    </div>
  )
}
