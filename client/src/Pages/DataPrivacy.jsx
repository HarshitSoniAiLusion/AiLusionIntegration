import React, { useState } from 'react'

export default function DataPrivacy() {
  const [check,setCheck]=useState(false);
  function handlePrivacy() {
     console.log('Done');
  }
  return (
    <div className='max-w-2xl mx-auto flex flex-col gap-8'>
      <h2 className='text-xl font-semibold text-center mt-10'>Terms and Conditons</h2>
      <div className="">
        <p className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur eligendi tempore id placeat eos    deleniti itaque sit nobis, perspiciatis porro sunt dignissimos officiis delectus ipsum dolore dicta vitae  optio quibusdam.</p>
      </div>
      <div className=" flex gap-4 items-center">
        <p className=''>I agree to the Terms and Condition</p>
        <input className='h-4 w-4' type="checkbox" id="isPrivacyChecked" />
      </div>
      <button onClick={handlePrivacy} className='px-4 py-2 text-white font-semibold border-2 border-green-400 bg-green-400 rounded-lg hover:text-black hover:bg-white'>Next</button>
    </div>
  )
}
