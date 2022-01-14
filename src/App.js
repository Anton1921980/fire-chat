import React, { useContext, createContext, useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar';
import AppRouter from './components/AppRouter';
import { Context } from './index'
import { useAuthState } from "react-firebase-hooks/auth"
import Loader from './components/Loader';
import { Container } from '@mui/material';

export const Context2 = createContext("Default Value");

function App() {
  const { auth } = useContext(Context)
  const [user, loading, error] = useAuthState(auth)


  const [opened, setOpened] = useState(false);

  if (loading) {
    <Loader />
  }

  return (
    
      <Context2.Provider value={{ opened, setOpened }}>
        <BrowserRouter>       
            <NavBar />
            <AppRouter />       
        </BrowserRouter>
      </Context2.Provider>
   
  );
}

export default App;
