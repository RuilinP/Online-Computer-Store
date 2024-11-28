import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './NavBar/NavBar';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

import NoPage from './pages/NoPage.js'
import Home from './pages/Home.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={< Home/>}/>
        <Route path="*" element = {< NoPage/>}/>
      </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
