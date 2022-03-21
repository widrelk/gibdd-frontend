import React, {useRef} from "react";
import {useNavigate} from "react-router";

import {ROLES} from './constants';

const HomePage = () => {
	const userData = useRef(JSON.parse(window.sessionStorage.getItem('userData')))
	const navigate = useNavigate();
	return(
		<div>
			<p>Домашняя страница</p>
			<div style={{display: 'flex'}}>
				<p style={{margin: '5px'}}>{`Пользователь: ${userData.current.name}`}</p>
				<button onClick={() => {
					window.sessionStorage.setItem('userData', null);
					navigate('/')
				}}>Выход</button>
			</div>
			{userData.current.role === ROLES.GAI &&
			<div>
				<p>Интерфейс сотрудника ГАИ</p>
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<button onClick={() => navigate('/vehiclePage')}>Зарегистрировать транспортное средство</button>
					<button onClick={() => navigate('/driverPage')}>Зарегистрировать водителя</button>
					<button onClick={() => navigate('/vehiclePage')}>Изменение данных о транспортном средстве</button>
					<button onClick={() => navigate('/driverPage')}>Изменение данных о водителе</button>
				</div>
			</div>
			}
			{userData.current.role === ROLES.GIBDD &&
			<div>
				<p>Интерфейс сотрудника ГИБДД</p>
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<button>Создать протокол о ДТП</button>
				</div>
			</div>
			}
			{userData.current.role === ROLES.ADMIN &&
			<div>
				<p>Интерфейс администратора</p>
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<button onClick={() => navigate('/usersManagement')}>Управление пользователями</button>
					<button onClick={() => navigate('/dictionaries')}>Управление справочниками</button>
				</div>
			</div>
			}
		</div>
	)
}

export default HomePage;
