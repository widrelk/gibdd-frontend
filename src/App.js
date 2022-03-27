import './App.css';

import React from "react";
import {Routes, Route} from "react-router-dom";
import {useNavigate} from "react-router";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import VehiclePage from "./VehiclePage";
import DriverPage from "./DriverPage";
import Dictionaries from "./Dictionaries";
import ProtocolPage from "./ProtocolPage";
import UsersManagement from "./UsersManagement";
import VehicleList from "./VehicleList";
import CitizensList from "./CitizensList";
import ProtocolList from "./ProtocolList";

function App() {
  const navigate = useNavigate();
  const userData = JSON.parse(window.sessionStorage.getItem('userData'))
  return (
    <div className="App">
      {(userData === null || userData === 'null') &&
      <LoginPage/>
      }
      {userData &&
        <>
          <div style={{display: 'flex'}}>
            <button onClick={() => navigate('/homePage')}>На главную</button>
            <p style={{marginLeft: '20px'}}>ГИБДД</p>
            <p style={{marginLeft: '20px'}}>Сотрудник: {userData.name}</p>
          </div>
          <Routes>
            <Route path='/' element={<div/>}/>
            <Route path='homePage' element={<HomePage/>}/>
            <Route path='vehiclePage' element={<VehiclePage/>}/>
            <Route path='vehicleList' element={<VehicleList/>}/>
            <Route path='driverPage' element={<DriverPage/>}/>
            <Route path='citizensList' element={<CitizensList/>}/>
            <Route path='dictionaries' element={<Dictionaries/>}/>
            <Route path='protocol' element={<ProtocolPage/>}/>
            <Route path='usersManagement' element={<UsersManagement/>}/>
            <Route path='protocolList' element={<ProtocolList/>}/>
          </Routes>
        </>
      }
    </div>
  );
}

export default App;
