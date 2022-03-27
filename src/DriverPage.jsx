import React, {useState, useEffect, useMemo} from "react";
import { Field, Form, Formik, FormikProps } from 'formik';
import {VEHICLE_CATEGORY} from "./constants";

import styles from './index.css';
import {useSearchParams} from "react-router-dom";
import DatePickerField from "./components/DatePickerField";

const DriverPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [addressDictionary, setAddressDictionary] = useState([])
	const makeAddresses = () => addressDictionary.map(address => <option value={address.id}>{`${address.countryName}, ${address.regionName}, ${address.cityName}, ${address.streetName}, ${address.houseNumber}`}</option>)


	const [dataModel, setDataModel] = useState(null);


	useEffect(() => {
		fetch('/api/Address')
			.then(response => response.json())
			.then(addresses => setAddressDictionary(addresses))

		let citizenId = searchParams.get('__citizen_id');

		if (citizenId) {
			fetch(`/api/SuperUser/id:int?id=${citizenId}`)
				.then(response => response.json())
				.then(data => {
					debugger
					setDataModel(data)
				});
		} else {
			setDataModel({
				"citizen": {
					"id": 0,
					"firstName": "",
					"lastName": "",
					"patronymic": "",
					"workPlaceName": "",
					"positionName": "",
					"phone": "",
					"sexId": 0,
					"registrationAddressId": 0,
					"residentialAddressId": 0,
					"workPlaceAddressId": 0
				},
				"passport": {
					"id": 0,
					"series": "",
					"number": "",
					"issueDate": "",
					"issuedBy": "",
					"isValid": true,
					"ownerId": 0
				},
				"driverLicense": {
					"id": 0,
					"series": "",
					"number": "",
					"startDate": "",
					"endDate": "",
					"isValid": true,
					"ownerId": 0
				}
			});
		}
	}, [])

	return(
		<div>
			<h3>Страница регистрации водителя</h3>
			{dataModel &&
				<>
					<p>Данные гражданина</p>
					<Formik
						initialValues={dataModel}
						onSubmit={(values, actions) => {
							console.log(JSON.stringify(values, null, 2));
							actions.setSubmitting(false);
						}}
					>
						{(props) => (
							<Form>
								<div className='driver-page__form-container'>
									<p>Личные данные:</p>
									<label>
										Фамилия
										<Field type="text" name='citizen.lastName'/>
									</label>
									<label>
										Имя
										<Field type="text" name='citizen.firstName'/>
									</label>
									<label>
										Отчество
										<Field type='text' name='citizen.patronymic'/>
									</label>
									<label>
										Пол
										<Field name='citizen.sexId' as='select'>
											<option value={1}>М</option>
											<option value={2}>Ж</option>
										</Field>
									</label>
									<label>
										Телефон
										<Field type='text' name='citizen.phone'/>
									</label>

									<label>
										Название места работы
										<Field type='text' name='citizen.workPlaceName'/>
									</label>
									<label>
										Название должности
										<Field type='text' name='citizen.positionName'/>
									</label>
									<label>
										Адрес места работы
										<Field name='citizen.workPlaceAddressId' as='select'>
											{makeAddresses()}
										</Field>
									</label>

									<label>
										Адрес проживания
										<Field name='citizen.livingAddress' as='select'>
											{makeAddresses()}
										</Field>
									</label>
									<label>
										Адрес регистрации
										<Field name='citizen.registrationAddress' as='select'>
											{makeAddresses()}
										</Field>
									</label>
									<label>
										Адрес места работы
										<Field name='citizen.workAddress' as='select'>
											{makeAddresses()}
										</Field>
									</label>
								</div>

								<div className='driver-page__form-container'>
									<p>Паспортные данные</p>
									<label>
										Серия
										<Field type='text' name='passport.series'/>
									</label>
									<label>
										Номер
										<Field type='text' name='passport.number'/>
									</label>
									<label>
										Дата выдачи
										<DatePickerField type='text' name='passport.issueDate'/>
									</label>
									<label>
										Кем выдан
										<Field type='text' name='passport.issuedBy'/>
									</label>
								</div>

									<div className='driver-page__form-container'>
										<p>Данные водительского удостоверения</p>
										<label>
											Серия
											<Field type='text' name='driverLicense.series'/>
										</label>
										<label>
											Номер
											<Field type='text' name='driverLicense.number'/>
										</label>
										<label>
											Дата выдачи
											<DatePickerField name='driverLicense.startDate'/>
										</label>
										<label>
											Дата окончания действия
											<Field type='text' name='driverLicense.endDate'/>
										</label>
										<div role='group'>
											Разрешённые группы:
											{VEHICLE_CATEGORY.map(cat => (
												<label>
													{cat.name}
													<Field type='checkbox' name='driverLicense.availableGroups' value={cat.id}/>
												</label>
											))}
										</div>
										<button type="submit">Сохранить</button>
									</div>
								</Form>
								)}
					</Formik>
				</>
			}
		</div>
	)
}

export default DriverPage;