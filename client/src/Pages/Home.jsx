import React from 'react'
import {useNavigate} from 'react-router-dom'

export default function Home() {
  const navigate=useNavigate();
  const handleClick=()=>{
    navigate('/signUp');
  }
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <button 
        className='px-4 py-2 border-2 border-fuchsia-900 bg-fuchsia-900 text-white rounded-md hover:bg-white hover:text-black'
        onClick={handleClick}
      >Try on</button>
    </div>
  )
}
