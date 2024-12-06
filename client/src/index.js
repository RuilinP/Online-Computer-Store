import React, { useEffect, useContext } from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './NavBar/NavBar';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useState } from 'react';
import { user_context } from './models/user_model.js';
import NoPage from './pages/NoPage.js'
import Login from './pages/Login.js'
import User from './pages/User.js'
import Cart from './pages/Cart.js';
import Register from './pages/Register.js';
import Computers from './pages/Computers.js';
import ComputerDetail from './pages/ComputerDetail.js';

import { get_user } from "./models/user_model.js";
import { UserContextProvider } from "./models/user_model.js";

const root = ReactDOM.createRoot(document.getElementById('root'));

function App(){
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
        get_user(token).then((userData) => {
            if (userData) {
                console.log("User loaded:", userData);
            }
        });
    }
}, []);


  return <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={< Computers/>}/>
          <Route path="login" element={< Login/>}/>
          <Route path="user" element={<User/>}/>
          <Route path="cart" element={<Cart/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="search/:searchTerm" element={<Computers/>}/>
          <Route path="computers/:id" element={<ComputerDetail />} /> 
          <Route path="*" element = {< NoPage/>}/>
        </Routes>
      </BrowserRouter>
  </div>
}

root.render(
  <UserContextProvider>
      <App />
  </UserContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
