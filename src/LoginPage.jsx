import React from "react";
import {useNavigate} from "react-router";

import {ROLES} from "./constants";

const userData = {
	name: 'Прохоров Иван Дмитриевич',
	role: ROLES.ADMIN,
	uid: 'unique id',
	userCode: 1,
	id: 2,
	// TODO: коды подразделение и прочего
}

const LoginPage = () => {
	const navigate = useNavigate();
	return(
		<div >
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
			>Логин</button>
		</div>
	)
}

export default LoginPage;