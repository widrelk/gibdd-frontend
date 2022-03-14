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
import {ROLES} from "./constants";

const userData = {
  name: 'Фамилия имя отчество',
  role: ROLES.ADMIN,
  uid: 'unique id',
  userCode: 1,
  // TODO: коды подразделение и прочего
}

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      {window.sessionStorage.getItem('userData') === 'null' &&
      <div >
        <p>Система ГИБДД</p>
        <p>Страница логина</p>
        <form style={{display: 'flex', flexDirection: 'column'}}>
          <label>
            Логин:
            <input type='text' name='login'/>
          </label>
          <label>
            Пароль:
            <input type='password' name='password'/>
          </label>
        </form>
        <button onClick={() => {
          window.sessionStorage.setItem('userData', JSON.stringify(userData));
          navigate('/homePage');
        }}
        >
          Войти
        </button>
      </div>
      }
      {window.sessionStorage.getItem('userData') !== 'null' &&
        <>
          <div style={{display: 'flex'}}>
            <button onClick={() => navigate('/homePage')}>На главную</button>
            <p style={{marginLeft: '20px'}}>ГИБДД</p>
          </div>
          <Routes>
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
