import React, {useState} from 'react';
import {Field, useField, useFormikContext} from "formik";

const AddressField = ({accessor, addressDictionary, ...props}) => {
	// const [showSelectModal, setShowSelectModal] = useState(false);
	// const { setFieldValue } = useFormikContext();
	// const [field] = useField(props);
	
	return(
		(props) => (<>
		<label>
			Страна
			<Field type="text" name={`${accessor}.countryName`}/>
		</label>
		<label>
			Регион
			<Field type="text" name={`${accessor}.regionName`}/>
		</label>
		<label>
			Город
			<Field type="text" name={`${accessor}.cityName`}/>
		</label>
		<label>
			Улица
			<Field type="text" name={`${accessor}.streetName`}/>
		</label>
		<label>
			Номер дома
			<Field type="number" name={`${accessor}.houseNumber`}/>
		</label>
	</>)
	)
}

export default AddressField;