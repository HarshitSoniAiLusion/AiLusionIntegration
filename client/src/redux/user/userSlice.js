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
        signUpStart:(state)=>{
            state.loading=true;
            state.error=null;
        },
        signUpFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        signUpSuccess:(state,action)=>{
            state.loading=false;
            state.error=null;
            state.currUser=action.payload;
        },
        CheckPrivacyStart:(state)=>{
            state.loading=true,
            state.error=null;
        },
        CheckPrivacySuccess:(state,action)=>{
            state.currUser=action.payload;
            state.error=null;
            state.loading=false;
        },
        CheckPrivacyFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        updateSubscriptionSuccess:(state,action)=>{
            state.error=null;
            state.loading=false;
            state.currUser=action.payload;
        },
        updateSubscriptionFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        updateSubscriptionStart:(state)=>{
            state.loading=true;
            state.error=null;
        },
        removeData:(state)=>{
            state.loading=false;
            state.error=null;
            state.currUser=null;
        }
    },
});

export const {
    signInStart,
    signInFailure,
    signInSuccess,
    signUpStart,
    signUpFailure,
    signUpSuccess,
    CheckPrivacySuccess,
    CheckPrivacyFailure, 
    CheckPrivacyStart,
    updateSubscriptionSuccess,
    updateSubscriptionStart,
    updateSubscriptionFailure,
    removeData
} = userSlice.actions;

export default userSlice.reducer;