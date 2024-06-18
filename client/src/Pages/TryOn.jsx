import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import FormData from 'form-data'

export default function TryOn() {
  const [humanFile,setHumanFile]=useState();
  const [garmentFile,setGarmentFile]=useState();
  const [humanImg,setHumanImg]=useState();
  const [garmentImg,setGarmentImg]=useState();
  const {currUser}=useSelector(state=>state.user);
  const [loading,setLoading]=useState(false);
  const [url,setUrl]=useState(null);
  const [key, setKey] = useState(0); 
  const handleHumanFile=(e)=>{
    setHumanFile(e.target.files[0]);
    setHumanImg(URL.createObjectURL(e.target.files[0]));
  }
  const handleGarmentFile=(e)=>{
    setGarmentFile(e.target.files[0]);
    setGarmentImg(URL.createObjectURL(e.target.files[0]));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
       const formData = new FormData();
       setUrl(null);
       formData.append("human_Img", humanFile);
       formData.append("garment_Img", garmentFile);
       setLoading(true);
       const res=await fetch(`/api/gpu/tryOn/${currUser._id}`,{
        method:'POST',
        headers:{},
        body:formData
       });
       const data=await res.json();
       setLoading(false);
       if(!res.ok){
        console.log(data.message);
       }
       setUrl(data.imageUrl);
       setKey(prev=>prev+1);
       return;
    }
    catch(err){
      console.log(err);
    }
  };
  console.log(url);
  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center min-h-screen"> 
        <div className="flex w-full items-center justify-center">
          <div className="w-1/2 flex flex-col gap-4 items-center">
            <h2 className='text-center text-lg font-semibold'>Human Image</h2>
            <input type="file" id="humanImg" onChange={handleHumanFile} />
            {humanImg && <img className=' h-80 w-60' src={humanImg} alt='humanImg'/>}
          </div>
          <div className="w-1/2 flex flex-col gap-4 items-center">
            <h2 className='text-center text-lg font-semibold'>Garment Image</h2>
            <input type="file" id="garmentImg" onChange={handleGarmentFile} />
            {garmentImg && <img className=' h-80 w-60' src={garmentImg} alt='garmentImg'/>}
          </div>
        </div>
        <button type='submit' className='text-md px-4 py-2 bg-green-400 border-2 border-green-600 hover:bg-white rounded-lg'>{loading?'...Loading':'TryOn'}</button>
        <div className="flex items-center justify-center p-10">
          {url && <img key={key} src={url} className=' w-60 h-80' alt="" />}
        </div>
    </form>
  )
}
