import './App.css';
import { BrowserRouter, Routes, Route, Outlet} from 'react-router-dom';
import Home from './pages/home';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import AppLayout from './pages/appLayout';
import LoadingModal from './Components/LoadingModal';


function App() {

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Outlet />}>
          <Route index element={<Home/>} />
          <Route path='/login/:userId' element={<Login />}/>
          <Route path='app' element = {<AppLayout/>}/>
          <Route path='loading' element = {<LoadingModal/>}/>
        </Route>
      </Routes>

    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
