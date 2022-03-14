import React, {useState} from "react";
import { Field, Form, Formik, FormikProps } from 'formik';
import {ROLES} from "./constants";
import {Table} from "./commons";
import styles from "./index.css";

const personnel = [
	{
		name: 'Админ админович',
		userCode: 1,
	},
	{
		name: 'Гаишник гаишникович',
		userCode: 2,
	},
	{
		name: 'Гибддшник гибддшникович',
		userCode: 3,
	},
]

const accountsData = [
	{
		name: 'Админ админович',
		login: 'admin_adminovich',
		role: ROLES.ADMIN,
		userCode: 1,
	},
	{
		name: 'Гаишник гаишникович',
		login: 'gaishnik_gaishnikovich',
		role: ROLES.GAI,
		userCode: 2,
	},
	{
		name: 'Гибддшник гибддшникович',
		login: 'gibddshnik_gibddshnikovich',
		role: ROLES.GIBDD,
		userCode: 3,
	},
];

const columns = [
	{
		Header: '№',
		Cell: ({row}) => row.index + 1,
	},
	{
		Header: 'ФИО',
		accessor: 'name',
		width: '350px'
	},
	{
		Header: 'Логин',
		accessor: 'login'
	},
	{
		Header: 'Категория доступа',
		accessor: 'role',
		Cell: ({cell}) => {
			// TODO: как-то переделать ROLES, чтоб не надо было делать так
			let val;
			switch (cell.value) {
				case 1:
					val = 'сотрудник ГАИ';
					break;
				case 2:
					val = 'сотрудник ГИБДД';
					break;
				case 3:
					val = 'администратор';
					break;
				default:
					val = 'неизвестно';
					break;
			}
			return val;
		}
	}
]

const UsersManagement = () => {
	const [selectedAccountNumber, setCurrentSelectedAccountNumber] = useState('');

	const handleDeleteAccount = () => {
		// TODO: запрос на удаление и обновление таблицы
	}

	const handleCreateAccount = () => {

	}

	return (
		<div>
			<p>Управление пользователями</p>
			<div style={{display: 'flex'}}>
				<div style={{width: '50%', overflowX: 'scroll'}}>
					<p>Список аккаунтов</p>
					<Table columns={columns} data={accountsData}/>
				</div>
				<div style={{width: '50%'}}>
					<div>
						<p>Удаление аккаунта</p>
						<label>
							Номер аккаунта
							<input
								type='number'
								value={selectedAccountNumber}
								onChange={(event) => setCurrentSelectedAccountNumber(event.target.value)}
								style={{margin: '0 5px 0 5px'}}
							/>
						</label>
						<button onClick={handleDeleteAccount}>Удалить аккаунт</button>
					</div>

					<div>
						<p>Создание аккаунта</p>
						<Formik
							initialValues={{
								account: 0,
								newLogin: '',
								newPassword: '',
								role: 0,
							}}
							onSubmit={(values, actions) => {
								alert(JSON.stringify(values, null, 2));
								actions.setSubmitting(false);
							}}
						>
							{(props) => (
								<Form className='accounts-page__create-user-form'>
									<label>
										Сотрудник
										<Field name='account' as='select'>
											{personnel.map(person => <option value={person.userCode}>{person.name}</option>)}
										</Field>
									</label>
									<label>
										Права доступа
										<Field name='role' as='select'>
											<option value={0}>ГАИ</option>
											<option value={1}>ГИБДД</option>
											<option value={2}>Администраор</option>
										</Field>
									</label>
									<label>
										Логин
										<Field type='text' name='newLogin'/>
									</label>
									<label>
										Пароль
										<Field type='text' name='newPassword'/>
									</label>
									<button style={{marginTop: '10px'}} type="submit">Добавить пользователя</button>
								</Form>
							)}
						</Formik>
					</div>

				</div>
			</div>
		</div>
	)
}

export default UsersManagement;