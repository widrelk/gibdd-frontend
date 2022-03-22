import './App.css';

import React from "react";
import {Routes, Route} from "react-router-dom";
import {useNavigate} from "react-router";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import VehiclePage from "./VehiclePage";
import DriverPage from "./DriverPage";
import Dictionaries from "./Dictionaries";
import Protocol from "./Protocol";
import UsersManagement from "./UsersManagement";

function App() {
  const navigate = useNavigate();
  const userData = window.sessionStorage.getItem('userData')
  return (
    <div className="App">
      {userData === null || userData === 'null' &&
      <LoginPage/>
      }
      {userData !== null && userData !== 'null' &&
        <>
          <div style={{display: 'flex'}}>
            <button onClick={() => navigate('/homePage')}>На главную</button>
            <p style={{marginLeft: '20px'}}>ГИБДД</p>
          </div>
          <Routes>
            <Route path='/' element={<div/>}/>
            <Route path='homePage' element={<HomePage/>}/>
            <Route path='vehiclePage' element={<VehiclePage/>}/>
            <Route path='driverPage' element={<DriverPage/>}/>
            <Route path='dictionaries' element={<Dictionaries/>}/>
            <Route path='protocol' element={<Protocol/>}/>
            <Route path='usersManagement' element={<UsersManagement/>}/>
          </Routes>
        </>
      }
    </div>
  );
}

export default App;
