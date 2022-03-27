import React, {useState, useEffect} from "react";
import {Table} from "./commons";
import {useNavigate} from "react-router";

const makeAddress = (addr) => `${addr.countryName} ${addr.regionName} ${addr.cityName} ${addr.streetName} ${addr.houseNumber}`;


const ProtocolList = () => {
	const navigate = useNavigate();
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch('/api/SuperProtocol')
			.then(response => response.json())
			.then(protocols => setData(protocols));
	}, [])

	const columns = [
		{
			Header: '№',
			Cell: ({row}) => row.index + 1,
			accessor: 'id'
		},
		{
			Header: 'Адрес происшествия',
			Cell: ({cell}) => makeAddress(cell.value),
			accessor: 'roadAccidentAddress'
		},
		{
			Header: 'Дата происшествия',
			Cell: ({cell}) => new Date(cell.value).toLocaleDateString("ru-RU"),
			accessor: 'creationDate'
		},
		{
			Header: 'Участники ДТП',
			Cell: ({cell}) => {
				let allParticipants = ''
				cell.value.forEach(participant => {
					const citizen = participant.superUser.citizen;
					allParticipants += `${citizen.firstName} ${citizen.lastName} ${citizen.patronymic}; `
				})
				return allParticipants
			},
			accessor: 'participants'
		},
		{
			Header: 'Участвововавшие ТС',
			Cell: ({cell}) => {
				let allAppendices = ''
				cell.value.forEach(appendice => {
					const vehicle = appendice.vehicle;
					allAppendices += `${vehicle.markName} ${vehicle.modelName} / ${vehicle.colorName}; `
				})
				return allAppendices
			},
			accessor: 'protocolAppendices'
		},
		{
			Header: '',
			Cell: ({row}) =>
				<button onClick={() => navigate(`/protocol?__protocol_id=${row.original.id}`)}>Просмотр</button>
			,
			accessor: 'button'
		}
	]

	return(
		<div>
			<p>Зарегистрированные ДТП</p>
			<Table columns={columns} data={data}/>
		</div>
	)
}

export default ProtocolList;