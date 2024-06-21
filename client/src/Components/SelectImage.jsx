import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

export default function SelectImage({isUploadGrament,setSelectedImages,selectedImages}) {
    const [Selected,setSelected]=useState([]);
    const [images,setImages]=useState([]);
    const [error,setError]=useState();
    const {currUser} = useSelector(state=>state.user);
    useEffect(()=>{
        const getImages=async()=>{
            try{
                const res=await fetch(`/api/images/getImages/${currUser._id}`);
                const data=await res.json();
                if(!res.ok){
                    console.log(data.message);
                    return;
                }
                setImages([...images,...data]);
            }catch(err){
                console.log(err);
            }
        }
        getImages();
    },[]);
    function handleSelection(gimg) {
        setError(null);
        if(Selected.includes(gimg._id) && !isUploadGrament){
            const SelectedIDFilter=Selected.filter((temp)=>temp!=gimg._id);
            setSelected(SelectedIDFilter);
            const filterImg=selectedImages.filter((simg)=>simg._id!=gimg._id);
            setSelectedImages(filterImg);
        }
        else if(!isUploadGrament){
            setSelected([...Selected,gimg._id]);
            setSelectedImages([...selectedImages,gimg]);
        }
        else{
            setError("Want to Select Images then don't Upload");
        }
    }
  return (
    <div className="border-2 border-black">
        <h2 className='text-lg text-center font-semibold'>Select the Garment Image</h2>
        {error && <h3 className='text-lg text-center font-semibold text-red-700 bg-red-300'>{error}</h3>}
        <div className="p-5 flex gap-4 flex-wrap">
            {images.length>0 && 
               images.map((gimg)=>(
                    <img key={gimg._id} onClick={()=>handleSelection(gimg)} 
                        className={`h-34 w-28 rounded-md border-4 ${Selected.includes(gimg._id) && 'border-blue-700'}`} src={gimg.imageUrl} 
                        alt="img" 
                    />
               ))
            } 
        </div>
    </div>
  )
}
