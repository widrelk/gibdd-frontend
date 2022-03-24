import React, {useState, useEffect} from "react";
import {Table} from "./commons";
import {useNavigate} from "react-router";


const VehicleList = () => {
	const navigate = useNavigate();
	const [tableData, setTableData] = useState([]);

	const openVehicle = (id) => {
		navigate(`/vehiclePage?__vehicle_id=${id}`);
	}

	const columns = [
		{
			Header: '№',
			Cell: ({row}) => row.index + 1,
			accessor: 'id'
		},
		{
			Header: 'Марка',
			accessor: 'markName',
		},
		{
			Header: 'Модель',
			accessor: 'modelName',
		},
		{
			Header: 'Цвет',
			accessor: 'colorName',
		},
		{
			Header: 'Масса',
			accessor: 'weight',
		},
		{
			Header: 'Максимально допустимая масса',
			accessor: 'maxWeight',
		},
		{
			Header: 'Год производства',
			accessor: 'creationDate',
			Cell: ({cell}) => new Date(cell.value).getFullYear()
		},
		{
			Header: 'Номер шасси',
			accessor: 'chassisNumber',
		},
		{
			Header: 'Номер кузова',
			accessor: 'bodyNumber',
		},
		{
			Header: 'VIN номер',
			accessor: 'vin',
		},
		{
			Header: 'Дата регистрации',
			accessor: 'registrationDate',
			Cell: ({cell}) => new Date(cell.value).toLocaleDateString("ru-RU")
		},
		{
			Header: '',
			accessor: 'custom',
			Cell: ({row}) =>
				<button onClick={() => openVehicle(row.original.id)}>Ред.</button>
		}

	]

	useEffect(() => {
		fetch('/api/SuperVehicle')
			.then(response => response.json())
			.then(rows => setTableData(rows))
	}, [])

	return(
		<div style={{overflowX: 'hidden'}}>
			Зарегистрированные транспортные средства
			<Table columns={columns} data={tableData}/>
		</div>
	)
}

export default VehicleList;