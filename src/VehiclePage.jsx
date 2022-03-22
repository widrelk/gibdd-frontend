import React, {useEffect, useState} from "react";
import { Field, Form, Formik, FormikProps } from 'formik';
import DatePickerField from "./components/DatePickerField";
import styles from './index.css'

import {VEHICLE_CATEGORY} from "./constants";

const VehiclePage = () => {
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
	}, []);

	return(
		<div>
			<p>Страница транспортного средства</p>
			<Formik
				initialValues={{
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
				}}
				onSubmit={(values, actions) => {
					const val = JSON.stringify(values);
					debugger
					fetch(`/api/vehicle`, {
						method: 'POST',
						body: JSON.stringify(values),
						headers: {
							'Content-Type': 'application/json'
						},
					})
						.then(response => {
							debugger
							if (response.ok) {
								alert('Элемент добавлен');
							} else {
								alert('Ошибка при добавлении');
							}
						})
				}}
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
								{colorsList.map(color => <option value={color.id}>{color.name}</option> )}
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
			</Formik>
		</div>
	)
}

export default VehiclePage;