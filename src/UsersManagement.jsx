import React, {useEffect, useState} from "react";
import { Field, Form, Formik, FormikProps } from 'formik';
import {ROLES} from "./constants";
import {Table} from "./commons";
import styles from "./index.css";

const accessCategories = [
		"сотрудник ДПС",
		"сотрудник ГИБДД",
		"администратор"
];

const accountsColumns = [
	{
		Header: '№',
		Cell: ({row}) => row.index + 1,
	},
	{
		Header: 'ФИО',
		accessor: 'FIO',
		width: '350px'
	},
	{
		Header: 'Логин',
		accessor: 'login'
	},
	{
		Header: 'Категория доступа',
		accessor: 'accessCategoryId',
	}
]



const UsersManagement = () => {
	const [selectedAccountNumber, setCurrentSelectedAccountNumber] = useState('');
	const [selectedEmployeeNumber, setCurrentSelectedEmployeeNumber] = useState('');

	const [accountsData, setUsersData] = useState([]);
	const [employeesList, setEmployeesList] = useState([])

	const [subdivisionsList, setSubdivisionsList] = useState([])
	const [ranksList, setRanksList] = useState([])
	const [positionsList, setPositionsList] = useState([])

	const employeesColumns = [
		{
			Header: '№',
			Cell: ({row}) => row.index + 1,
		},
		{
			Header: 'Сотрудник',
			accessor: 'FIO',
		},
		{
			Header: 'Подразделение',
			accessor: 'subdivisionId',
			Cell: ({cell}) => subdivisionsList.find(subdiv => subdiv.id === cell.value)?.name,
		},
		{
			Header: 'Звание',
			accessor: 'rankId',
			Cell: ({cell}) => ranksList.find(rank => rank.id === cell.value)?.name
		},
		{
			Header: 'Должность',
			accessor: 'positionId',
			Cell: ({cell}) => positionsList.find(pos => pos.id === cell.value)?.name
		},
	]

	const updateUsersData = () => {
		fetch('api/Accounts')
			.then(response => response.json())
			.then(data => {
				data = data.map(row => {
					row.accessCategoryId = accessCategories[row.accessCategoryId - 1]
					return row;
				})
				fetch('api/Employee')
					.then(response => response.json())
					.then(employees => {
						employees = employees.map(empl => {
							empl.FIO = `${empl.firstName} ${empl.lastName} ${empl.patronymic}`
							return empl;
						})

						data = data.map(row => {
							let employee = employees.find(empl => empl.id === row.employeeId);

							row.FIO = employee.FIO;
							return row
						})
						setEmployeesList(employees);
						setUsersData(data);
					})
			});
	}

	useEffect(() => {
		updateUsersData();
		fetch('/api/Subdivision')
			.then(response => response.json())
			.then(subdivisions => setSubdivisionsList(subdivisions))
		fetch('/api/Rank')
			.then(response => response.json())
			.then(ranks => setRanksList(ranks))
		fetch('/api/Position')
			.then(response => response.json())
			.then(positions => setPositionsList(positions))
	}, [])

	const handleDeleteAccount = () => {
		fetch(`/api/accounts/${accountsData[parseInt(selectedAccountNumber) - 1].id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
		})
			.then(response => {
				if (response.ok) {
					alert('Элемент удалён');
				} else {
					alert('Ошибка при удалении');
				}
				updateUsersData();
			})
	}

	const updateEmployeeData = () => {
		fetch('api/Employee')
			.then(response => response.json())
			.then(employees => {
				employees = employees.map(empl => {
					empl.FIO = `${empl.firstName} ${empl.lastName} ${empl.patronymic}`
					return empl;
				})
				setEmployeesList(employees);})
	}

	const handleDeleteEmployee = () => {
		fetch(`/api/employee/${employeesList[parseInt(selectedEmployeeNumber) - 1].id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
		})
			.then(response => {
				if (response.ok) {
					alert('Элемент удалён');
				} else {
					alert('Ошибка при удалении');
				}
				updateEmployeeData();
			})
	}

	return (
		<div>
			<p>Управление пользователями</p>
			<div style={{display: 'flex'}}>
				<div style={{width: '50%', overflowX: 'scroll'}}>
					<p>Список аккаунтов</p>
					<Table columns={accountsColumns} data={accountsData}/>
					<p>Список сотрудников</p>
					<Table columns={employeesColumns} data={employeesList}/>
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
								id:0,
								login: '',
								password: '',
								employeeId: 0,
								accessCategoryId: 1,
							}}
							onSubmit={(values, actions) => {
								fetch('/api/accounts', {
									method: 'POST',
									body: JSON.stringify(values),
									headers: {
										'Content-Type': 'application/json'
									},
								}).then(response => {
									if (response.ok) {
										alert('Элемент добавлен');
									} else {
										alert('Ошибка при добавлении');
									}
									updateUsersData();
								})
								actions.setSubmitting(false);
							}}
						>
							{(props) => (
								<Form className='accounts-page__form-container'>
									<label>
										Сотрудник
										<Field name='employeeId' as='select'>
											{employeesList.map(empl => <option value={empl.id}>{empl.FIO}</option>)}
										</Field>
									</label>
									<label>
										Права доступа
										<Field name='accessCategoryId' as='select'>
											<option value={1}>ДПС</option>
											<option value={2}>ГИБДД</option>
											<option value={3}>Администраор</option>
										</Field>
									</label>
									<label>
										Логин
										<Field type='text' name='login'/>
									</label>
									<label>
										Пароль
										<Field type='text' name='password'/>
									</label>
									<button style={{marginTop: '10px'}} type="submit">Добавить пользователя</button>
								</Form>
							)}
						</Formik>
					</div>

					<div>
						<p>Удаление сотрудника</p>
						<label>
							Номер сотрудника
							<input
								type='number'
								value={selectedEmployeeNumber}
								onChange={(event) => setCurrentSelectedEmployeeNumber(event.target.value)}
								style={{margin: '0 5px 0 5px'}}
							/>
						</label>
						<button onClick={handleDeleteEmployee}>Удалить сотрудника</button>
					</div>

					<div>
						<p>Регистрация сотрудника</p>
						<Formik
							initialValues={{
								id: 0,
								firstName: '',
								lastName: '',
								patronymic: '',
								subdivisionId: 1,
								rankId: 1,
								positionId: 1,
							}}
							onSubmit={(values, actions) => {
								fetch('/api/employee', {
									method: 'POST',
									body: JSON.stringify(values),
									headers: {
										'Content-Type': 'application/json'
									},
								}).then(response => {
									debugger
									if (response.ok) {
										alert('Элемент добавлен');
									} else {
										alert('Ошибка при добавлении');
									}
									updateUsersData();
								})
								actions.setSubmitting(false);
							}}
						>
							{(props) => (
								<Form className='accounts-page__form-container'>
									<label>
										Фамилия
										<Field type="text" name='lastName'/>
									</label>
									<label>
										Имя
										<Field type="text" name='firstName'/>
									</label>
									<label>
										Отчество
										<Field type='text' name='patronymic'/>
									</label>
									<label>
										Подразделение
										<Field name='subdivisionId' as='select'>
											{subdivisionsList.map(subdiv => <option value={subdiv.id}>{subdiv.name}</option>)}
										</Field>
									</label>
									<label>
										Звание
										<Field name='rankId' as='select'>
											{ranksList.map(rank => <option value={rank.id}>{rank.name}</option>)}
										</Field>
									</label>
									<label>
										Должность
										<Field name='positionId' as='select'>
											{positionsList.map(pos => <option value={pos.is}>{pos.name}</option>)}
										</Field>
									</label>
									<button style={{marginTop: '10px'}} type="submit">Зарегистрировать</button>
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