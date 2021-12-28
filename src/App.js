import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar';
import AppRouter from './components/AppRouter';

function App() {
  return (
    <div>
      <BrowserRouter>       
        <NavBar />
        <AppRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
