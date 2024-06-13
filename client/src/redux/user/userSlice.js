import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currUser:null,
    error:null,
    loading:false
}

export const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
            state.error=null;
        },
        signInFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        signInSuccess:(state,action)=>{
            state.loading=false;
            state.error=null;
            state.currUser=action.payload;
        },
    },
});

export const {signInStart,signInFailure,signInSuccess} = userSlice.actions;

export default userSlice.reducer;