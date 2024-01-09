import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/home';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import AppLayout from './pages/appLayout';
import { useContext, useEffect } from 'react';
import { userContext } from './Components/userContext';
import { getReload } from './Apis/helperApis';


function App() {
  const {setUser,user} = useContext(userContext)
  // useEffect(()=>{
  //   async function reload () {
  //     try{
  //       const resp = await getReload();
  //       if(resp){
  //         setUser((p)=>{
  //           return{...p,accessToken:resp.accessToken,userId:resp.userId,email:resp.email,
  //           name:resp.name,email:resp.email,picture:resp.picture
  //           }
  //       })
  //       }
     
  //     }catch(err){

  //     }
  //   }
  //   if(!!user)reload()
    
  // },[user])
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Outlet />}>
          <Route index element={<Home />} />
          <Route path='/login/:userId' element={<Login />}/>
          <Route path='/app' element = {<AppLayout/>}/>
        </Route>
      </Routes>

    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
