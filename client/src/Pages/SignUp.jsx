import React from 'react'

export default function SignUp() {
  return (
    <div className='w-full min-h-screen flex flex-col gap-4 items-center justify-center'>
      <h1 className='text-center text-xl font-bold'>Sign Up</h1>
        <div className=" rounded-xl bg-fuchsia-900 p-10">
          <form action="" className='flex flex-col items-center justify-center gap-4'>
            <input 
              type="text" 
              className=' w-80 rounded-md p-2 outline-none'
              placeholder='Enter Username'
            />
            <input 
              type="email" 
              className=' w-80 rounded-md p-2 outline-none'
              placeholder='Enter Email'
            />
            <input 
              type="password" 
              className=' w-80 rounded-md p-2 outline-none'
              placeholder='Enter Password'
            />
            <button className='text-white px-4 py-2 rounded-md bg-green-600'>Sign Up</button>
          </form>
        </div>
    </div>
  )
}
