import React from "react";
import { Field, Form, Formik, FormikProps } from 'formik';
import {VEHICLE_CATEGORY} from "./constants";

import styles from './index.css';

const DriverPage = () => {
	return(
		<div>
			<h3>Страница регистрации водителя</h3>
			<Formik
				initialValues={{
					surname: '',
					name: '',
					patronym: '',
					chassisNumber: '',
					bodyNumber: '',
					productionYear: '',
					livingAddress: '',
					registrationAddress: '',
					workAddress: '',
					color: '',
					passport: {
						series: '',
						number: '',
						emissionDate: '',
						emissioner: '',
					},
					license: {
						series: '',
						number: '',
						emissDate: '',
						expDate: '',
						availableGroups: [],
					}
				}}
				onSubmit={(values, actions) => {
					console.log(JSON.stringify(values, null, 2));
					actions.setSubmitting(false);
				}}
			>
				{(props) => (
					<Form style={{display: 'flex', flexDirection: 'row'}}>
						<div className='driver-page__form-container'>
							<p>Личные данные:</p>
							<label>
								Фамилия
								<Field type="text" name='surname'/>
							</label>
							<label>
								Имя
								<Field type="text" name='name'/>
							</label>
							<label>
								Отчество
								<Field type='text' name='patronym'/>
							</label>
							<label>
								Пол
								<Field name='gender' as='select'>
									<option value={1}>М</option>
									<option value={2}>Ж</option>
								</Field>
							</label>
							<label>
								Телефон
								<Field type='text' name='chassisNumber'/>
							</label>
							<label>
								Название места работы
								<Field type='text' name='bodyNumber'/>
							</label>
							<label>
								Название должности
								<Field type='text' name='productionYear'/>
							</label>
							<label>
								Адрес проживания
								<Field name='livingAddress' as='select'>
									<option value={1}>Адрес 1</option>
									<option value={2}>Адрес 2</option>
								</Field>
							</label>
							<label>
								Адрес регистрации
								<Field name='registrationAddress' as='select'>
									<option value={1}>Адрес 3</option>
									<option value={2}>Адрес 4</option>
								</Field>
							</label>
							<label>
								Адрес места работы
								<Field name='workAddress' as='select'>
									<option value={1}>Адрес 5</option>
									<option value={2}>Адрес 6</option>
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
							{/*TODO: date*/}
							<label>
								Дата выдачи
								<Field type='text' name='passport.emissionDate'/>
							</label>
							<label>
								Кем выдан
								<Field type='text' name='passport.emissioner'/>
							</label>
							<p>Данные водительского удостоверения</p>
							<label>
								Серия
								<Field type='text' name='license.series'/>
							</label>
							<label>
								Номер
								<Field type='text' name='license.number'/>
							</label>
							{/*TODO: date*/}
							<label>
								Дата выдачи
								<Field type='text' name='license.emissDate'/>
							</label>
							{/*TODO: date*/}
							<label>
								Дата окончания действия
								<Field type='text' name='license.expDate'/>
							</label>
							<div role='group'>
								Разрешённые группы:
								{VEHICLE_CATEGORY.map(cat => (
									<label>
										{cat.name}
										<Field type='checkbox' name='license.availableGroups' value={cat.id}/>
									</label>
								))}
							</div>
						</div>
						<button type="submit">Сохранить</button>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default DriverPage;