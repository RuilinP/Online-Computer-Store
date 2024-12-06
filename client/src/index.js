import React from 'react';
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

const root = ReactDOM.createRoot(document.getElementById('root'));

function App(){
  const [user, setUser] = useState(undefined);

  return <div>
    <user_context.Provider value={{user:user, setUser:setUser}}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={< Computers/>}/>
          <Route path="login" element={< Login/>}/>
          <Route path="user" element={<User/>}/>
          <Route path="cart" element={<Cart/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="*" element = {< NoPage/>}/>
        </Routes>
      </BrowserRouter>
    </user_context.Provider>
  </div>
}

root.render( <App/>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
