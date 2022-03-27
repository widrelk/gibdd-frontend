import React, {useState, useEffect} from 'react';
import {Table} from "./commons";
import {useNavigate} from "react-router";


const makeAddress = (addr) => `${addr.countryName} ${addr.regionName} ${addr.cityName} ${addr.streetName} ${addr.houseNumber}`;


const CitizensList = () => {
	const navigate = useNavigate();
	const [tableData, setTableData] = useState([])

	const openCitizen = (citizenId) => {
		debugger
		navigate(`/driverPage?__citizen_id=${citizenId}`)
	}

	const columns = [
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
			Header: 'Адрес места работы',
			accessor: 'citizen.workPlaceAddress',
			Cell: ({cell}) => makeAddress(cell.value),
		},
		{
			Header: '',
			accessor: 'custom',
			Cell: ({row}) => <button onClick={() => openCitizen(row.original.citizen.id)}>Ред.</button>

		}
	]

	useEffect(() => {
		fetch('/api/SuperUser')
			.then(response => response.json())
			.then(citizens => setTableData(citizens));
	})

	return (
		<div style={{overflowX: 'hidden'}}>
			Зарегистрированные граждане
			<Table columns={columns} data={tableData}/>
		</div>
	)
}

export default CitizensList;