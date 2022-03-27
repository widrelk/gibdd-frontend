import React, {useState, useEffect, useRef} from 'react';
import {useSearchParams} from "react-router-dom";
import {Field, Form, Formik} from "formik";
import Modal from 'react-modal';

import styles from './index.css';
import DatePickerField from "./components/DatePickerField";
import {Table} from "./commons";

const makeAddress = (addr) => `${addr.countryName} ${addr.regionName} ${addr.cityName} ${addr.streetName} ${addr.houseNumber}`;

const makeAddressFields = (accessor, openModalCallback, editable) => {
		return(
			<div style={{display: 'flex', flexDirection: 'column'}}>
				<label>
					Страна
					<Field type="text" name={`${accessor}.countryName`} readOnly={!editable}/>
				</label>
				<label>
					Регион
					<Field type="text" name={`${accessor}.regionName`} readOnly={!editable}/>
				</label>
				<label>
					Город
					<Field type="text" name={`${accessor}.cityName`} readOnly={!editable}/>
				</label>
				<label>
					Улица
					<Field type="text" name={`${accessor}.streetName`} readOnly={!editable}/>
				</label>
				<label>
					Номер дома
					<Field type="number" name={`${accessor}.houseNumber`} readOnly={!editable}/>
				</label>
				{editable && <button type='button' onClick={() => openModalCallback(accessor)}>Выбрать из справочника</button>}
			</div>)
}

const ProtocolPage = () => {
	const userData = useRef(JSON.parse(window.sessionStorage.getItem('userData')))
	const [searchParams, setSearchParams] = useSearchParams();
	const [dataModel, setDataModel] = useState(null);

	const [showAddressModal, setShowAddressModal] = useState(false);
	const [showVehicleModal, setShowVehicleModal] = useState(false);
	const [showCitizenModal, setShowCitizenModal] = useState(false);

	const [addressDictionary, setAddressDictionary] = useState([]);
	const [vehiclesDictionary, setVehicleDictionary] = useState([]);
	const [citizenDictionary, setCitizenDictionary] = useState([]);
	const [roleDictionary, setRoleDictionary] = useState([]);
	const [markDictionary, setMarkDictionary] = useState([]);

	const [creationFlag, setCreationFlag] = useState(false);
	const formRef = useRef(null);

	const addressAccessorRef = useRef(null);
	const [addressFieldValue, setAddressFieldValue] = useState(0);

	useEffect(() => {
		let protocolId = searchParams.get('__protocol_id');
		if (protocolId) {
			fetch(`/api/SuperProtocol/${protocolId}`)
				.then(response => response.json())
				.then(data => {
					setDataModel(data)
				});
		} else {
			setCreationFlag(true);
			fetch(`/api/Employee/${userData.current.id}`)
				.then(response => response.json())
				.then(empl => {
					setDataModel({
						"roadAccidentAddress": {
							"id": 0,
							"countryName": "",
							"regionName": "",
							"cityName": "",
							"streetName": "",
							"houseNumber": 0,
						},
						"creationPalceAddress": {
							"id": 0,
							"countryName": "",
							"regionName": "",
							"cityName": "",
							"streetName": "",
							"houseNumber": 0
						},
						creator: empl,
						employeeId: empl.id,
						"participants": [],
						"protocolAppendices": [],
						"id": 0,
						"creationDate": "",
						"roadAccidentAddressId": 0,
						"creationPalceAddressId": 0,
					});
				})
		}
		fetch('/api/SuperVehicle')
			.then(response => response.json())
			.then(vehicles => setVehicleDictionary(vehicles))
		fetch('/api/SuperUser')
			.then(response => response.json())
			.then(citizens => setCitizenDictionary(citizens));
		fetch('/api/Address')
			.then(response => response.json())
			.then(addresses => setAddressDictionary(addresses))
		fetch('/api/RoleInRoadAccident')
			.then(response => response.json())
			.then(roles => setRoleDictionary(roles))
	}, [])

	const addCitizen = (citizenIndex) => {
		const modelCopy = JSON.parse(JSON.stringify(formRef.current.values));
		if (citizenIndex !== -1) {
			modelCopy.participants.push({
				superUser: citizenDictionary[citizenIndex],
				roleInRoadAccident: roleDictionary[0],
				roleInRoadAccidentId: 1,
				citizenId: 0,
				protocolId: 0,
				testimony: '',
			})
		} else {
			modelCopy.participants.push({
				superUser: {
					"citizen": {
						id: 0,
						firstName: '',
						lastName: '',
						patronymic: '',
						workPlaceName: '',
						positionName: '',
						phone: '',
						sexId: 0,
						registrationAddressId: 0,
						residentialAddressId: 0,
						workPlaceAddressId: 0,
						registrationAddress: {
							"id": 0,
							"countryName": '',
							"regionName": '',
							"cityName": '',
							"streetName": '',
							"houseNumber": 0
						},
						residentialAddress: {
							"id": 0,
							"countryName": '',
							"regionName": '',
							"cityName": '',
							"streetName": '',
							"houseNumber": 0
						},
						workPlaceAddress: {
							"id": 0,
							"countryName": '',
							"regionName": '',
							"cityName": '',
							"streetName": '',
							"houseNumber": 0
						}
					},
					passport: {
						"id": 0,
						"series": '',
						"number": '',
						"issueDate": "",
						"issuedBy": '',
						"isValid": true,
						"ownerId": 0
					},
					driverLicense: {
						"id": 0,
						"series": '',
						"number": '',
						"startDate": "",
						"endDate": "",
						"isValid": true,
						"ownerId": 0
					}
				},
				roleInRoadAccidentId: 1,
				citizenId: 0,
				protocolId: 0,
				testimony: '',
			})
		}
		formRef.current.setValues(modelCopy);
		setShowCitizenModal(false);
	}
	const addVehicle = (vehicleIndex) => {
		const modelCopy = JSON.parse(JSON.stringify(formRef.current.values));
		modelCopy.protocolAppendices.push({
			vehicle: vehiclesDictionary[vehicleIndex],
			id: 0,
			damageDescription: '',
			protocolId: 0,
			vehicleId: 0,
		})
		formRef.current.setValues(modelCopy);
		setShowVehicleModal(false);
	}

	const loadAddressCallback = (accessor) => {
		setShowAddressModal(true)
		addressAccessorRef.current = accessor;
	}

	const vehiclesTableColumns = [
		{
			Header: '№',
			Cell: ({row}) => row.index + 1,
			accessor: 'id'
		},
		{
			Header: 'Регистрационный номер',
			accessor: 'number',
		},
		// {
		// 	Header: 'Марка',
		// 	accessor: 'markName',
		// },
		{
			Header: 'Модель',
			accessor: 'modelName',
		},
		{
			Header: 'Цвет',
			accessor: 'colorName',
		},
		{
			Header: 'Год производства',
			accessor: 'creationDate',
			Cell: ({cell}) => new Date(cell.value).getFullYear()
		},
		{
			Header: '',
			accessor: 'custom',
			Cell: ({row}) =>
				<button onClick={() => addVehicle(row.index)}>Добавить</button>
		}
	]

	const citizensTableColumns = [
		{
			Header: '№',
			Cell: ({row}) => row.index + 1,
			accessor: 'iterator'
		},
		{
			Header: 'ФИО',
			accessor: 'citizenFIO',
			Cell: ({row}) => {
				let citizen = row.original.citizen;
				return(`${citizen.firstName} ${citizen.lastName} ${citizen.patronymic}`);
			}
		},
		{
			Header: 'Пол',
			accessor: 'citizen.sexId',
			Cell: ({cell}) => cell.value === 1 ? 'М' : 'Ж',
		},
		{
			Header: 'Телефон',
			accessor: 'citizen.phone',
		},
		{
			Header: 'Адрес регистрации',
			accessor: 'citizen.registrationAddress',
			Cell: ({cell}) => makeAddress(cell.value)
		},
		{
			Header: 'Адрес проживания',
			accessor: 'citizen.residentialAddress',
			Cell: ({cell}) => makeAddress(cell.value)
		},
		{
			Header: 'Серия/номер пасспорта',
			accessor: 'passport',
			Cell: ({cell}) => `${cell.value.series}/${cell.value.number}`
		},
		{
			Header: 'Серия/номер прав',
			accessor: 'driverLicense',
			Cell: ({cell}) => `${cell.value.series}/${cell.value.number}`
		},
		{
			Header: 'Место работы',
			accessor: 'citizen.workPlaceName',
		},
		{
			Header: '',
			accessor: 'custom',
			Cell: ({row}) =>
				<button onClick={() => addCitizen(row.index)}>Добавить</button>
		}
	]

	return(
		<div>
			<p>Страница {creationFlag ? 'создания' : 'просмотра'} протокола ДТП</p>

			{dataModel &&
				<Formik
					enableReinitialize={true}
					initialValues={dataModel}
					innerRef={formRef}
					onSubmit={(values, actions) => {
						for (let i = 0; i < values.participants.length; i++){
							debugger
							values.participants[i].roleInRoadAccident = roleDictionary.find(elem => elem.id === values.participants[i].roleInRoadAccidentId)
						}
						debugger
						fetch('/api/SuperProtocol', {
							method: 'POST',
							body: JSON.stringify(values),
							headers: {
								'Content-Type': 'application/json'
							},
						})
							.then(response => {
								if (response.ok) {
									alert('Элемент добавлен');
								} else {
									console.log(response.body.json())
									alert('Ошибка при добавлении');
								}
							})
					}}
					>
					{(props) => (
						<Form className='protocol-page__form-container'>

								<label>
									Составил сотрудник: {`${formRef.current?.values?.creator?.firstName} ${formRef.current?.values?.creator?.lastName} ${formRef.current?.values?.creator?.patronymic}`}
								</label>
								<label>
									Дата составления протокола
									<DatePickerField name='creationDate'/>
								</label>

								<p>Место происшествия</p>
								{makeAddressFields('roadAccidentAddress', loadAddressCallback, creationFlag)}

								<p>Место составления протокола</p>
								{makeAddressFields('creationPalceAddress', loadAddressCallback, creationFlag)}


								<p>Участники происшествия</p>
							<fieldset disabled={!creationFlag}>
								{formRef.current?.values?.participants?.map((participant, index) => (
									<div style={{marginTop: '30px', padding: '5px', border: '1px solid black'}}>
										<p style={{textAlign: 'left'}}>Участник {index + 1}</p>

										<label>
											Фамилия
											<Field type="text" name={`participants[${index}].superUser.citizen.firstName`}/>
										</label>
										<label>
											Имя
											<Field type="text" name={`participants[${index}].superUser.citizen.lastName`}/>
										</label>
										<label>
											Отчество
											<Field type="text" name={`participants[${index}].superUser.citizen.patronymic`}/>
										</label>
										<label>
											Пол
											<Field name={`participants[${index}].superUser.citizen.sexId`} as='select'>
												<option value={1}>М</option>
												<option value={2}>Ж</option>
											</Field>
										</label>
										<label style={{marginTop: '30px'}}>
											Место проживания
											{makeAddressFields(`participants[${index}].superUser.citizen.residentialAddress`, loadAddressCallback, creationFlag)}
										</label>
										<label style={{marginTop: '30px'}}>
											Место регистрации
											{makeAddressFields(`participants[${index}].superUser.citizen.registrationAddress`, loadAddressCallback, creationFlag)}
										</label>

										<label>
											Роль в ДТП
											<Field name={`participants[${index}].roleInRoadAccidentId`} as='select'>
												{roleDictionary.map(role => <option value={role.id}>{role.roleName}</option>)}
											</Field>
										</label>

										<label style={{marginTop: '30px'}}>
											Место работы
											<Field type="text" name={`participants[${index}].superUser.citizen.workPlaceName`}/>
										</label>
										<label>
											Адрес места работы
											{makeAddressFields(`participants[${index}].superUser.citizen.workPlaceAddress`, loadAddressCallback)}
										</label>
										<label>
											Должность
											<Field type="text" name={`participants[${index}].superUser.citizen.positionName`}/>
										</label>

										<label style={{marginTop: '30px'}}>
											Телефон
											<Field type="phone" name={`participants[${index}].superUser.citizen.phone`}/>
										</label>

										<label>
											Показания
											<Field type="textarea" name={`participants[${index}].testimony`}/>
										</label>

										<p style={{marginTop: '30px'}}>Паспортные данные</p>
										<label>
											Серия
											<Field type='text' name={`participants[${index}].superUser.passport.series`}/>
										</label>
										<label>
											Номер
											<Field type='text' name={`participants[${index}].superUser.passport.number`}/>
										</label>
										<label>
											Дата выдачи
											<DatePickerField name={`participants[${index}].superUser.passport.issueDate`}/>
										</label>
										<label>
											Кем выдан
											<Field type='text' name={`participants[${index}].superUser.passport.issuedBy`}/>
										</label>

										<p style={{marginTop: '30px'}}>Данные водительского удостоверения (при наличии)</p>
										<label>
											Серия
											<Field type='text' name={`participants[${index}].superUser.driverLicense.series`}/>
										</label>
										<label>
											Номер
											<Field type='text' name={`participants[${index}].superUser.driverLicense.number`}/>
										</label>
										<label>
											Дата выдачи
											<DatePickerField type='text' name={`participants[${index}].superUser.driverLicense.startDate`}/>
										</label>
										<label>
											Дата окончания действия
											<Field type='text' name={`participants[${index}].superUser.driverLicense.endDate`}/>
										</label>
									</div>
								))}
							</fieldset>
								{creationFlag && <button onClick={() => setShowCitizenModal(true)} type='button'>Добавить участника происшествия</button>}

									<p>Участвующие транспортные средства</p>
									{
										formRef.current?.values?.protocolAppendices?.map((info, index) => (
											<div style={{marginTop: '30px', padding: '5px', border: '1px solid black'}}>
												<p style={{textAlign: 'left'}}>Транспортное средство {index + 1}</p>

												<label>
													Регистрационный номер
													<Field type='text' name={`protocolAppendices[${index}].vehicle.number`} readOnly/>
												</label>
												{/*TODO: как-то сделать отображение марки*/}
												{/*<label>*/}
												{/*	Марка*/}
												{/*	<Field type='text' name={`protocolAppendices[${index}].vehicle.markName`} readOnly/>*/}
												{/*</label>*/}
												<label>
													Категория
													<Field type='text' name={`protocolAppendices[${index}].vehicle.categoryName`}/>
												</label>
												<label>
													Модель
													<Field type='text' name={`protocolAppendices[${index}].vehicle.modelName`} readOnly/>
												</label>
												<label>
													Описание повреждений
													<Field type='text' name={`protocolAppendices[${index}].damageDescription`}/>
												</label>
											</div>
										))
									}
								{creationFlag && <button onClick={() => setShowVehicleModal(true)} type='button'>Добавить ТС</button>}

								{creationFlag && <button type='submit'>Сохранить протокол</button>}
						</Form>
					)}
				</Formik>
			}
			<Modal
				isOpen={showVehicleModal}
				onRequestClose={() => {
					setShowVehicleModal(false);
				}}
			>
				<p>Добавление транспортного средства в протокол. Выберите ТС из списка ниже</p>
				<Table data={vehiclesDictionary} columns={vehiclesTableColumns}/>
				<button onClick={() => setShowVehicleModal(false)}>Закрыть окно</button>
			</Modal>

			<Modal
				isOpen={showCitizenModal}
				onRequestClose={() => {
					setShowCitizenModal(false);
				}}
			>
				<p>Добавление участника ДТП в протокол. Выберите участника из списка ниже</p>
				<button onClick={() => addCitizen(-1)}>Добавить участника вручную</button>
				<Table data={citizenDictionary} columns={citizensTableColumns}/>
				<button onClick={() => setShowCitizenModal(false)}>Закрыть окно</button>
			</Modal>

			<Modal
				isOpen={showAddressModal}
				onRequestClose={() => {
					setShowAddressModal(false);
				}}
			>
				<p>Выбор из списка существующих адресов</p>
				<select value={addressFieldValue} onChange={(event) => setAddressFieldValue(event.target.value)}>
					{addressDictionary.map((address, index) => <option value={index}>{makeAddress(address)}</option>)}
				</select>
				<button onClick={() => {
					const modelCopy = JSON.parse(JSON.stringify(formRef.current.values));
					modelCopy[addressAccessorRef.current] = addressDictionary[addressFieldValue];

					formRef.current.setValues(modelCopy);
					setShowAddressModal(false);
				}}>Выбрать</button>
				<button onClick={() => setShowAddressModal(false)}>Закрыть окно</button>
			</Modal>
		</div>
	)
}

export default ProtocolPage;
