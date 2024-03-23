import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import Alert from '@mui/material/Alert';

const VendorForm = ({ addVendor, rowData }) => {

    const [isValidName, setIsValidName] = useState(true);
    const sku_names = rowData.map(row => row.name_id);
    const [isFormValidated, setIsFormValidated] = useState(false);

    const [vendorData, setVendorData] = useState({
        name_id: '',
        origin: '',
        pp_rate_: '',
        exchange_rate_: '',
    });

    const [missingFields, setMissingFields] = useState([]);

    {
        missingFields.length > 0 && (
            <Alert variant="danger">
                Please fill out the following fields: {missingFields.join(', ')}
            </Alert>
        )
    }

    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setVendorData({ ...vendorData, [name]: value });

        if (name === 'name_id' && vendorData.name_id.length > 1)
            (value && sku_names.map(name => name.toLowerCase()).includes(value.toLowerCase())) ? setIsValidName(false) : setIsValidName(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newMissingFields = Object.keys(vendorData).filter(key => !vendorData[key]);
        // setMissingFields(newMissingFields);

        if (newMissingFields.length > 0) {
            setMissingFields(newMissingFields);
            setIsFormValidated(true);
            return;
        }

        setIsFormValidated(true); // Show success styles if needed //but this is all BS, we qare not using it 

        try {
            const response = await axios.post('http://localhost:8000/vendor', vendorData);
            if (addVendor && response.status == 200)
                addVendor(vendorData)
            setVendorData({
                name_id: '',
                origin: '',
                pp_rate_: '',
                exchange_rate_: '',
            });
            setIsFormValidated(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className='d-flex flex-row flex-start justify-content-between' onKeyDown={handleKeyPress} style={{ marginLeft: 42, marginRight: 42, marginTop: 24}}>
            <Form onSubmit={handleSubmit}>
                <div className="d-flex flex-row justify-content-between" style={{ width: '100%' }}>
                    <div className="m-1">
                        <Form.Label>Vendor ID</Form.Label>
                        <Form.Group controlId="name_id">
                            <Form.Control
                                type="text"
                                name="name_id"
                                value={vendorData.name_id}
                                onChange={handleChange}
                                placeholder="Enter Vendor ID"
                                isInvalid={isFormValidated && !vendorData.name_id}
                                isValid={isFormValidated && vendorData.name_id}
                                style={{ backgroundColor: isValidName ? 'white' : 'rgba(225, 0, 0, 0.6)' }}
                            />
                        </Form.Group>
                    </div>
                    <div className="m-1">

                        <Form.Group controlId="origin">
                            <Form.Label>Origin</Form.Label>
                            <Form.Control
                                type="text"
                                name="origin"
                                value={vendorData.origin}
                                onChange={handleChange}
                                placeholder="Enter Origin"
                                isInvalid={isFormValidated && !vendorData.origin}
                                isValid={isFormValidated && vendorData.origin}
                                required
                            />
                        </Form.Group>
                    </div>
                    <div className='m-1'>


                        <Form.Group controlId="pp_rate_">
                            <Form.Label>PP Rate</Form.Label>
                            <Form.Control
                                type="number"
                                name="pp_rate_"
                                value={vendorData.pp_rate_}
                                onChange={handleChange}
                                placeholder="Enter PP Rate %"
                                isInvalid={isFormValidated && !vendorData.pp_rate_}
                                isValid={isFormValidated && vendorData.pp_rate_}
                                required
                            />
                        </Form.Group>
                    </div>
                    <div className='m-1'>

                        <Form.Group controlId="exchange_rate_">
                            <Form.Label>Exchange Rate</Form.Label>
                            <Form.Control
                                type="number"
                                name="exchange_rate_"
                                value={vendorData.exchange_rate_}
                                onChange={handleChange}
                                placeholder="Enter Exchange Rate %"
                                isInvalid={isFormValidated && !vendorData.exchange_rate_}
                                isValid={isFormValidated && vendorData.exchange_rate_}
                                required
                            />
                        </Form.Group>
                    </div>
                </div>
            </Form>
            <Button variant="primary" type="submit" onClick={handleSubmit} className='mb-1 mt-1'>
                Submit
            </Button>
        </div>
    );
};

export default VendorForm;