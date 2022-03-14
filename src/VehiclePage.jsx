import React from "react";
import { Field, Form, Formik, FormikProps } from 'formik';
import DatePicker from 'react-date-picker'
import styles from './index.css'

import {VEHICLE_CATEGORY} from "./constants";

const VehiclePage = () => {
	return(
		<div>
			<p>Страница транспортного средства</p>
			<Formik
				initialValues={{
					weight: 0,
					maxWeight: 0,
					vin: '',
					chassisNumber: '',
					bodyNumber: '',
					productionYear: 2000,
					registrationDate: 2000,
				}}
				onSubmit={(values, actions) => {
					alert(JSON.stringify(values, null, 2));
					actions.setSubmitting(false);
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
							Год выпуска:
							<Field type='text' name='productionYear'/>
						</label>
						<label>
							Дата постановки на учёт:
							<Field type='text' name='registrationDate'/>
						</label>
						<label>
							Производитель
							<Field name='manufacturer' as='select'>
								<option value={1}>Говноваз</option>
								<option value={2}>Бынтли</option>
							</Field>
						</label>
						{/*<label>*/}
						{/*	Модель*/}
						{/*	<Field name='model' as='select'>*/}
						{/*		{}*/}
						{/*	</Field>*/}
						{/*</label>*/}
						<label>
							Цвет
							<Field name='color' as='select'>
								<option value={1}>Плохой</option>
								<option value={2}>Отвратительный</option>
							</Field>
						</label>
						<label>
							Категория ТС
							<Field name='category' as='select'>
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