import React, { useState } from 'react'

export default function SelectImage() {
    const [isSelected,setIsSelected]=useState(false);
    const handleSelection=()=>{
        setIsSelected(!isSelected);
    }
  return (
    <div className="border-2 border-black">
        <h2 className='text-lg text-center font-semibold'>Select the Garment Image</h2>
        <div className="p-5">
            <img onClick={handleSelection} className={`h-34 w-28 rounded-md border-4 ${isSelected && 'border-blue-700'}`} src="https://images.pexels.com/photos/1887975/pexels-photo-1887975.jpeg" alt="img" />
        </div>
    </div>
  )
}
