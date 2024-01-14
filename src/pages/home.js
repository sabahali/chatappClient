import React, { useContext, useEffect, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import { userContext } from '../Components/userContext';
import { useNavigate } from 'react-router-dom';
import { getReload } from '../Apis/helperApis';
import { Typography } from '@mui/material';


const Home = () => {
  const navigate = useNavigate()
  const {setUser,user} = useContext(userContext)
  const[logText,setLogText] = useState(null)
  useEffect(()=>{
    async function reload () {
      try{
        const resp = await getReload();
        if(resp){
          setUser((p)=>{
            return{...p,accessToken:resp.accessToken,userId:resp.userId,email:resp.email,
            name:resp.name,email:resp.email,picture:resp.picture
            }
        })
        }
     
      }catch(err){
        setLogText('Please Sign In')
      }
    }
    if(user?.email === '' ){
      reload()
    }
    
  },[])
  useEffect(()=>{
    console.log(user)
  },[user])
  const handleLogin = useGoogleLogin({
    onSuccess: codeResponse => console.log(codeResponse),
    flow: 'auth-code',
    ux_mode:'redirect',
    redirect_uri:'http://localhost:8000/redirecturi',
    
  });
  return (
    <div className='flex w-screen items-center flex-col h-screen bg-slate-800 text-slate-300'>
      <div className='flex justify-around w-screen p-4 text-slate-300 mt-5 '>
        <button className='text-xl hover:text-slate-50  px-4 py-1 bg-slate-600 rounded-full hover:bg-slate-700'
        onClick={()=>{
          navigate('app')
        }}
        > Chatapp</button>
        <button className='text-xl hover:text-slate-50  px-4 py-1 bg-slate-600 rounded-full hover:bg-slate-700'> About Us</button>
        <button className='text-xl hover:text-slate-50  px-4 py-1 bg-slate-600 rounded-full hover:bg-slate-700'
        onClick={() => handleLogin()}
        > Sign In</button>
      </div>
      {logText && <Typography>{logText}</Typography>}
      <div className='flex flex-col  w-screen h-screen justify-center items-center'>
        <p className='text-4xl hover:text-slate-50 hover:cursor-pointer self-center md:text-6xl'>
          Welcome to chat app 
        </p>
        <p className='text-xl text-slate-500 hover:cursor-pointer mt-10 md:text-4xl'>
          Your Everday Messenger
        </p>
        
      </div>
    
    </div>
  )
}

export default Home