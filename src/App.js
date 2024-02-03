import './App.css';
import { BrowserRouter, Routes, Route, Outlet} from 'react-router-dom';
import Home from './pages/home';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import AppLayout from './pages/appLayout';
import { useContext, useEffect, useState } from 'react';
import { userContext } from './Components/userContext';
import { getReload } from './Apis/helperApis';


function App() {

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Outlet />}>
          <Route index element={<Home/>} />
          <Route path='login/:userId' element={<Login />}/>
          <Route path='app' element = {<AppLayout/>}/>
        </Route>
      </Routes>

    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
