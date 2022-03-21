import React, {useState, useEffect} from "react";
import { Field, Form, Formik, FormikProps } from 'formik';
import {Table} from "./commons";

import styles from './index.css';

const dictionaries = [
	{
		name: 'Адрес',
		path: 'Address',
		columns: [
			{
				Header: '№',
				Cell: ({row}) => row.index + 1,
				accessor: 'id',
			},
			{
				Header: 'Страна',
				accessor: 'countryName',
			},
			{
				Header: 'Регион',
				accessor: 'regionName',
			},
			{
				Header: 'Город',
				accessor: 'cityName',
			},
			{
				Header: 'Улица',
				accessor: 'streetName',
			},
			{
				Header: 'Номер дома',
				accessor: 'houseNumber',
			},
		]
	},
	{
		name: 'Цвет',
		path: 'Color',
		columns: [
			{
				Header: '№',
				Cell: ({row}) => row.index + 1,
				accessor: 'id',
			},
			{
				Header: 'Название цвета',
				accessor: 'name',
			}
		]
	},
	{
		name: 'Марка',
		path: 'Mark',
		columns: [
			{
				Header: '№',
				Cell: ({row}) => row.index + 1,
				accessor: 'id',
			},
			{
				Header: 'Марка',
				accessor: 'name',
			}
		]
	},
	{
		name: 'Модель',
		path: 'Model',
		columns: [
			{
				Header: '№',
				Cell: ({row}) => row.index + 1,
				accessor: 'id',
			},
			{
				Header: 'Марка',
				accessor: 'markId',
				requiredDictionary: 'Mark',
				converter: (subDic) => subDic.map(mark => mark.name),
				requiredDictionaryHandler: (dictionaryArray, setData) => {
						fetch("/api/Mark")
							.then(response => response.json())
							.then(subDic => {
								dictionaryArray = dictionaryArray.map((row) => {
									row.markId = subDic[row.markId - 1].name
									return row;
								})
								setData(dictionaryArray);
							})
				},
			},
			{
				Header: 'Модель',
				accessor: 'name',
			}
		]
	},
	{
		name: 'Подразделение',
		path: 'Subdivision',
		columns: [
			{
				Header: '№',
				Cell: ({row}) => row.index + 1,
				accessor: 'id',
			},
			{
				Header: 'Название подразделения',
				accessor: 'name',
			},
			{
				Header: 'Адрес',
				accessor: 'addressId',
				requiredDictionary: 'Address',
				converter: (subDic) => subDic.map(addr => `${addr.countryName}, ${addr.regionName}, ${addr.cityName}, ${addr.streetName}, ${addr.houseNumber}`),
				requiredDictionaryHandler: (dictionaryArray, setData) => {
					fetch("/api/Address")
						.then(response => response.json())
						.then(subDic => {
							dictionaryArray = dictionaryArray.map((row) => {
								const address = subDic[row.addressId - 1];
								row.addressId = `${address.countryName}, ${address.regionName}, ${address.cityName}, ${address.streetName}, ${address.houseNumber}`
								return row;
							})
							setData(dictionaryArray);
						})
				}
			}
		]
	},
	{
		name: 'Должность',
		path: 'position',
		columns: [
			{
				Header: '№',
				Cell: ({row}) => row.index + 1,
				accessor: 'id',
			},
			{
				Header: 'Наименование',
				accessor: 'name'
			}
		]
	},
	{
		name: 'Звание',
		path: 'Rank',
		columns: [
			{
				Header: '№',
				Cell: ({row}) => row.index + 1,
				accessor: 'id',
			},
			{
				Header: 'Наименование',
				accessor: 'name'
			}
		]
	},
]

const Dictionaries = () => {
	const [currentDictionaryIndex, setCurrentDictionaryIndex] = useState(0);
	const [data, setData] = useState([]);

	const [formikInitialValues, setFormikInitialValues] = useState({});


	const [selectedId, setSelectedId] = useState(0);

	const [subComponents, setSubcomponents] = useState({});

	const updateTable = () => {
		fetch(`/api/${dictionaries[currentDictionaryIndex].path}`)
			.then(response => response.json())
			.then(dictionaryArray => {
				const dictionary = dictionaries[currentDictionaryIndex];

				dictionary.columns.forEach(column => {
					if (column.requiredDictionaryHandler) {
						column.requiredDictionaryHandler(dictionaryArray, setData);
					}
				})
				setData(dictionaryArray);
			})
	}

	useEffect(() => {
		setData([]);
		setSubcomponents({})
		updateTable();
		const formikInitVals = {};
		dictionaries[currentDictionaryIndex].columns.forEach(column => {
			formikInitVals[column.accessor] = column.requiredDictionary ? 0 : '';
		})
		setFormikInitialValues(formikInitVals)
		dictionaries[currentDictionaryIndex].columns.map(column => {
			if (column.requiredDictionary) {
				fetch(`api/${column.requiredDictionary}`)
					.then(response => response.json())
					.then(subDict => {
						subDict = column.converter(subDict);
						setSubcomponents({
							...subComponents, [column.requiredDictionary]: (
								<label>
									{column.Header}
									<Field name={column.accessor} as='select'>
										{subDict.map((elem, index) =>
											<option value={index} key={`${column.accessor}-${index}`}>{elem}</option>)
										}
									</Field>
								</label>
							)
						})
					})
			}
		})


	}, [currentDictionaryIndex])

	useEffect(() => {


	}, [dictionaries[currentDictionaryIndex]])

	const handleDeleteItem = () => {
		fetch(`/api/${dictionaries[currentDictionaryIndex].path}/${data[selectedId - 1].id}`, {
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
				updateTable();
			})
	}

	return(
		<div>
			<p>Справочники приложения</p>
			<label>
				Справочник
				<select
					name='targetDictionary'
					onChange={(event) => setCurrentDictionaryIndex(event.target.value)}
				>
					{dictionaries.map((elem, index) =>
						<option value={index}>{elem.name}</option>)
					}
				</select>
			</label>
			<div style={{display: 'flex'}}>
				<div style={{width: '50%', overflowX: 'scroll'}}>
					{data.length !== 0 &&
					(<Table columns={dictionaries[currentDictionaryIndex].columns} data={data}/>)
					}
					{data.length === 0 && (<p>Не выбран справочник</p>)}
				</div>
				<div style={{width: '50%',}}>
					<div>
						<p>Удаление элемента</p>
						<label>
							Номер элемента
							<input
								type='number'
								value={selectedId}
								onChange={(event) => setSelectedId(event.target.value)}
								style={{margin: '0 5px 0 5px'}}
							/>
						</label>
						<button onClick={handleDeleteItem}>Удалить элемент</button>
					</div>
					<div>
						<p>Создание/обновление элемента (для обновления укажите соответствующий номер, для создания оставьте его равным 0)</p>
						<Formik
						initialValues={formikInitialValues}
						onSubmit={(values, actions) => {
							values.id = parseInt(values.id) - 1;
							if (values.id < 0) {
								fetch(`/api/${dictionaries[currentDictionaryIndex].path}`, {
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
										updateTable();
									})
							} else {
								fetch(`/api/${dictionaries[currentDictionaryIndex].path}`, {
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
										updateTable();
									})
							}
						}}
						>
							{(props) => (
								<Form className={'dictionaries-page__form-container'}>
									{dictionaries[currentDictionaryIndex].columns.map((column, id) => {
										if (column.requiredDictionary) {
											return(subComponents[column.requiredDictionary])
										} else {
											return (
												<label id={`form-input-${id}`}>
													{column.Header}
													<Field type='text' name={column.accessor}/>
												</label>
											)
										}
									})}
									<button style={{marginTop: '10px'}} type="submit">Отправить</button>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</div>


		</div>
	)
}

export default Dictionaries;