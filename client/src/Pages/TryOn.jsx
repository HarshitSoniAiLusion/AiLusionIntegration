import React, { useState } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import FormData from 'form-data'
import HashLoader from "react-spinners/HashLoader";
import {getTryOnFailure,getTryOnSuccess,getTryOnStart, clossError} from '../redux/user/userSlice.js';
import { RxCross2 } from "react-icons/rx";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "gray",
};

export default function TryOn() {
  const [humanFile,setHumanFile]=useState();
  const [garmentFile,setGarmentFile]=useState();
  const [humanImg,setHumanImg]=useState();
  const [garmentImg,setGarmentImg]=useState();
  const {currUser,loading,error}=useSelector(state=>state.user);
  const [url,setUrl]=useState(null);
  const dispatch=useDispatch();

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
       dispatch(getTryOnStart());
       const res=await fetch(`/api/gpu/tryOn/${currUser._id}`,{
        method:'POST',
        headers:{},
        body:formData
       });
       const data=await res.json();
       if(!res.ok){
        dispatch(getTryOnFailure(data.message));
        return;
       }
       setUrl(data.imageUrl);
       dispatch(getTryOnSuccess(data.user));
       return;
    }
    catch(err){
      dispatch(getTryOnFailure(data.message));
      return;
    }
  };

  return (
    <div className="">
      {loading && <div className="mx-auto mt-40">
        <HashLoader
          color={'#36d7b7'}
          loading={loading}
          size={100}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
          className=''
        />
      </div>}
    <form onSubmit={handleSubmit} className={`w-full flex flex-col items-center justify-center min-h-screen ${loading && 'hidden'}`}> 
        {error && 
          <div 
            className='text-red-700 bg-red-300 font-semibold text-lg rounded-lg p-4 flex items-center justify-center gap-4'
          ><p>{error}</p> <RxCross2 onClick={()=>dispatch(clossError())}/></div>}
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
        <button type='submit' className='text-md px-4 py-2 bg-green-400 border-2 border-green-600 hover:bg-white rounded-lg font-semibold'>TryOn</button>
        <div className="flex items-center justify-center p-10">
          {url && <img src={url} className=' w-60 h-80' alt="" />}
        </div>
    </form>
    </div>
  )
}
