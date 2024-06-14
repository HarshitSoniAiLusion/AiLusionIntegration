import React, { useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import {getDownloadURL, getStorage, uploadBytesResumable,ref} from 'firebase/storage'
import {app} from '../firebase.js'
import {useSelector} from 'react-redux';

export default function VTON() {
  const filePickRef1=useRef();
  const filePickRef2=useRef();
  const {currUser} = useSelector(state=>state.user);
  const [humanFile,setHumanFile]=useState();
  const [garmentFile,setGarmentFile]=useState();
  const [humanImg,setHumanImg]=useState();
  const [garmentImg,setGarmentImg]=useState();
  const [images,setImages]=useState({});
  const [imageFileUploading,setImageFileUploading]=useState(false);
  const [imageFileUploadError,setImageFileUploadError]=useState(null);
  const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null);
  const [imgError,setImgError]=useState(null);
  const handleHumanImage=(e)=>{
    const file=e.target.files[0];
    if(file){
      setHumanFile(file);
      setHumanImg(URL.createObjectURL(file));
    }
  }
  const handleGarmentImage=(e)=>{
    const file=e.target.files[0];
    if(file){
      setGarmentFile(file);
      setGarmentImg(URL.createObjectURL(file));
    }
  }
  useEffect(()=>{
    if(humanFile){
      uploadHumanImg();
    }
    if(garmentFile){
      uploadGarmentImg()
    }
  },[humanFile , garmentFile]);

  const uploadHumanImg=()=>{
    setImgError(null);
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage=getStorage(app);
    const fileName=new Date().getTime()+humanFile.name;
    const storageRef=ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,humanFile);

    uploadTask.on(
      'state_changed',
      (snapshot)=>{
        const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error)=>{
        setImageFileUploadError(error.message);
        setImageFileUploading(false);
        setImageFileUploadProgress(null);
        setHumanImg(null);
        humanFile(null); 
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
            setImageFileUploadError(null);
            setImageFileUploadProgress(null);
            setImageFileUploading(false); 
            setImages({...images,['humanImg']:downloadUrl});
        });
      }
    )
  }
  const uploadGarmentImg=()=>{
    setImgError(null);
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage=getStorage(app);
    const fileName=new Date().getTime()+garmentFile.name;
    const storageRef=ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,garmentFile);

    uploadTask.on(
      'state_changed',
      (snapshot)=>{
        const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error)=>{
        setImageFileUploadError(error.message);
        setImageFileUploading(false);
        setImageFileUploadProgress(null);
        setGarmentImg(null);
        setGarmentFile(null);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
            setImageFileUploadError(null);
            setImageFileUploadProgress(null);
            setImageFileUploading(false);
            setImages({...images,['garmentImg']:downloadUrl});
            setGarmentFile(null);
        });
      }
    )
  }
  const handleImageStor=async()=>{
    setImgError(null);
    if(!humanImg || !garmentImg){
      setImgError('First Select the Images');
      return;
    }
    try{
      const res=await fetch(`/api/images/addImage/${currUser._id}`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(images)
      });
      const data=await res.json();
      if(!res.ok){
        setImgError(data.message);
        return;
      }
      console.log(data);
      return;
    }
    catch(err){
      setImgError(err.name);
      return;
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-10">
      <div className="flex items-center flex-col w-full">
        {imgError && <p className='text-red-500 text-lg font-semibold'>{imgError}</p>}
        {imageFileUploading && <p className='text-lg font-semibold'>{imageFileUploadProgress}%</p>}
        <div className="flex items-center justify-evenly w-full">
          {humanImg?
            <img src={humanImg} className='w-62 h-96'/>
          :<div className="border-2 border-black h-60 p-5 flex flex-col items-center justify-evenly rounded-lg">
            <h2 className='text-md font-semibold'>Human Image</h2>
            <input type="file" disabled={imageFileUploading} accept='images/*' onChange={handleHumanImage} ref={filePickRef1} hidden/>
            <button className="" onClick={()=>filePickRef1.current.click()}>
                <FaCloudUploadAlt className='text-3xl'/>
            </button>
          </div>
          }
          {garmentImg? 
            <img src={garmentImg} className='w-62 h-96'/>
          :<div className="border-2 border-black h-60 p-5 flex flex-col items-center justify-evenly rounded-lg">
            <h2 className='text-md font-semibold'>Garment Image</h2>
            <input type="file" disabled={imageFileUploading} accept='images/*' onChange={handleGarmentImage}  ref={filePickRef2} hidden/>
            <button className="" onClick={()=>filePickRef2.current.click()}>
                <FaCloudUploadAlt className='text-3xl'/>
            </button>
          </div>}
        </div>
      </div>
      <button onClick={handleImageStor} className='text-white border-2 border-green-400 hover:bg-white hover:text-black bg-green-400 font-semibold w-32 py-2 rounded-lg'>TryOn</button>
      <div className="w-full">Select Images</div>
    </div>
  )
}
