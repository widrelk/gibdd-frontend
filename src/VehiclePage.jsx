import React, {useEffect, useState} from "react";
import { Field, Form, Formik, FormikProps } from 'formik';
import DatePickerField from "./components/DatePickerField";
import styles from './index.css'

import {VEHICLE_CATEGORY} from "./constants";
import {useSearchParams} from "react-router-dom";

const VehiclePage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [dataModel, setDataModel] = useState(null)

	const [modelsList, setModelsList] = useState([]);
	const [marksList, setMarksList] = useState([]);
	const [colorsList, setColorsList] = useState([]);

	useEffect(() => {
		fetch('/api/model')
			.then(response => response.json())
			.then(models => setModelsList(models)
			);
		fetch('/api/mark')
			.then(response => response.json())
			.then(marks => setMarksList(marks));
		fetch('/api/color')
			.then(response => response.json())
			.then(colors => setColorsList(colors));
		let vehicleId = searchParams.get('__vehicle_id');
		if (vehicleId) {
			fetch(`/api/Vehicle/${vehicleId}`)
				.then(response => response.json())
				.then(data => setDataModel(data));
		} else {
			setDataModel({
				id: 0,
				weight: 0,
				maxWeight: 0,
				creationDate: '',
				chassisNumber: '',
				bodyNumber: '',
				vin: '',
				registrationDate: '',
				modelId: 1,
				markId: 1,
				colorId: 1,
				categoryId: 1,
			});
		}
	}, []);

	return(
		<div>
			<p>Страница {dataModel?.id === 0 ? 'создания' : 'редактирования'} транспортного средства</p>
			{dataModel &&
				<Formik
				initialValues={dataModel}
				onSubmit={(values, actions) => {
					if (dataModel.id === 0) {
						debugger
						fetch('/api/vehicle', {
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
									alert('Ошибка при добавлении');
								}
							})
					} else {
						debugger
						fetch('/api/vehicle', {
							method: 'PUT',
							body: JSON.stringify(values),
							headers: {
								'Content-Type': 'application/json'
							},
						})
							.then(response => {
								if (response.ok) {
									alert('Элемент обновлён');
								} else {
									alert('Ошибка при обновлении');
								}
							})
					}
				}
				}

			>
				{(props) => (
					<Form className='vehicle-page__form'>
						<label>
							Масса в снаряжённом состоянии
							<Field type="number" name='weight'/>
						</label>
						<label>
							Технически допустимая масса
							<Field type="number" name='maxWeight'/>
						</label>
						<label>
							Дата производства
							<DatePickerField name='creationDate'/>
						</label>
						<label>
							VIN номер:
							<Field type='text' name='vin'/>
						</label>
						<label>
							Номер шасси:
							<Field type='text' name='chassisNumber'/>
						</label>
						<label>
							Номер кузова:
							<Field type='text' name='bodyNumber'/>
						</label>
						<label>
							Дата постановки на учёт:
							<DatePickerField type='text' name='registrationDate'/>
						</label>
						<label>
							Производитель
							<Field name='markId' as='select'>
								{marksList.map(mark => <option value={mark.id}>{mark.name}</option>)}
							</Field>
						</label>
						<label>
							Модель
							<Field name='modelId' as='select'>
								{modelsList.map(model => <option value={model.id}>{model.name}</option>)}
							</Field>
						</label>
						<label>
							Цвет
							<Field name='colorId' as='select'>
								{colorsList.map(color => <option value={color.id}>{color.name}</option>)}
							</Field>
						</label>
						<label>
							Категория ТС
							<Field name='categoryId' as='select'>
								{VEHICLE_CATEGORY.map(cat => (
									<option value={cat.id}>{cat.name}</option>
								))}
							</Field>
						</label>
						<button style={{marginTop: '10px'}} type="submit">Сохранить</button>
					</Form>
				)}
			</Formik>}
		</div>
	)
}

export default VehiclePage;