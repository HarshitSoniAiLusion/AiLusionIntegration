import React, { useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import {getDownloadURL, getStorage, uploadBytesResumable,ref} from 'firebase/storage'
import {app} from '../firebase.js'
import {useSelector} from 'react-redux';
import SelectImage from '../Components/SelectImage.jsx';


export default function VTON() {
  const filePickRef1=useRef();
  const filePickRef2=useRef();
  const {currUser} = useSelector(state=>state.user);
  const [humanFile,setHumanFile]=useState();
  const [garmentFile,setGarmentFile]=useState();
  const [humanImg,setHumanImg]=useState();
  const [garmentImg,setGarmentImg]=useState([]);
  const [isUploadGrament,setIsUploadGarment]=useState(false);
  const [images,setImages]=useState({});
  const [imageFileUploading,setImageFileUploading]=useState(false);
  const [imageFileUploadError,setImageFileUploadError]=useState(null);
  const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null);
  const [imgError,setImgError]=useState(null);
  const [selectedImages,setSelectedImages]=useState([]);
  const [loading,setLoading]=useState(false);


  
  const handleHumanImage=(e)=>{
    const file=e.target.files[0];
    if(file){
      setHumanFile(file);
    }
  }
  const handleGarmentImage=(e)=>{
    const file=e.target.files[0];
    if(file){
      setGarmentFile(file);
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
            setHumanImg(downloadUrl);
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
            setIsUploadGarment(true);
            setGarmentImg([...garmentImg,downloadUrl]);
            setGarmentFile(null);
        });
      }
    )
  }
  const storGarmentImage=async()=>{
    setImgError(null);
      if(!humanImg || !garmentImg){
        setImgError('First Select the Images');
        return;
      }
      try{
        setLoading(true);
        const res=await fetch(`/api/images/addImage/${currUser._id}`,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(garmentImg)
        });
        const data=await res.json();
        if(!res.ok){
          setImgError(data.message);
          return;
        }
        setLoading(false);
        console.log(data);
        return;
      }
      catch(err){
        setImgError(err.name);
        return;
      }
  }
  const handleImageStor=async()=>{
    //if Uploaded than stor the Images and call the GPU
    if(isUploadGrament){
        //Step-1 Check the SubsCription and Trial
        if(currUser && currUser.trial>0){

        }
        else if(currUser.isSubscribed.trialRemaining && currUser.isSubscribed.trialRemaining>0){

        }
        else if(currUser.isSubscribed.trialRemaining && currUser.isSubscribed.trialRemaining<=0){
          if(new Date().getDate()-7<=currUser.isSubscribed.endTime.gerDate()){

          }
          else{

          }
        }
        else{

        }
    }
    else{
      //Call the GPU Server
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-10">
      <div className="flex items-center flex-col w-full">
        {imgError && <p className='text-red-700 bg-red-300 rounded-lg px-4 py-2 text-lg font-semibold'>{imgError}</p>}
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
          {garmentImg.length>0 &&
            <div className="">
                {garmentImg.map((gimg)=>(<img src={gimg} className='w-20 h-32'/>))}
            </div>
          }
          <div className={`border-black ${ (imageFileUploading || selectedImages.length>0) && 'border-gray-300'} border-2  h-60 p-5 flex flex-col items-center justify-evenly rounded-lg`}>
            <h2 className='text-md font-semibold'>Garment Image</h2>
            <input 
              type="file" 
              disabled={imageFileUploading || selectedImages.length>0} 
              accept='images/*' 
              onChange={handleGarmentImage}  
              ref={filePickRef2}
              hidden
            />
            <button className="" onClick={()=>filePickRef2.current.click()}>
                <FaCloudUploadAlt className='text-3xl'/>
            </button>
          </div>
        </div>
      </div>
      <button 
        onClick={handleImageStor} 
        className='text-white border-2 border-green-400 hover:bg-white hover:text-black bg-green-400 font-semibold w-32 py-2 rounded-lg'
        disabled={loading}
      >{loading?'...Loading':'TryOn'}</button>
      <div className="w-full">
        <SelectImage isUploadGrament={isUploadGrament} setSelectedImages={setSelectedImages} selectedImages={selectedImages}/>
      </div>
    </div>
  )
}
