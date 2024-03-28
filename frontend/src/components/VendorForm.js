import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
import { getData } from './CskuForm';



const VendorForm = ({ addVendor, rowData }) => {

    // const { vendorTag } = useSkuForm();
    const [isValidName, setIsValidName] = useState(true);
    const [newPtColor, setNewPtColor] = useState(false);
    const sku_names = rowData.map(row => row.name_id);
    const [isFormValidated, setIsFormValidated] = useState(false);
    const [vendorTag, setVendorTag] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [productPtr, setProductPtr] = useState([]);

    useEffect(() => {
        const getVendorTag = () => {
            getData('vendortag', '').then((data) => {
                setVendorTag(data);
            });
        }
        getVendorTag();
        setProductPtr(localStorage.getItem('vendorTagItem') || vendorTag[0])
    }, [addVendor]);

    window.pv = vendorTag;
    window.ppp = productPtr;
    const [vendorData, setVendorData] = useState({
        name_id: '',
        origin: '',
        pp_rate_: '',
        exchange_rate_: '',
        vendor_tag: '',
    });

    window.user = vendorData;
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
                vendor_tag: ''
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

    const handlePT = (tag) => () => {
        localStorage.setItem('vendorTagItem', tag);
        setProductPtr(tag);
        setVendorData({ ...vendorData, ['vendor_tag']: tag });
    };

    const hadlePTBlur = (e) => {
        localStorage.setItem('vendorTagItem', e.target.value);
        setVendorData({ ...vendorData, ['vendor_tag']: e.target.value });
        if (e.target.value && !vendorTag.includes(e.target.value))
            setNewPtColor(true)
        else
            setNewPtColor(false)
    };

    return (
        <div className='d-flex flex-row flex-start justify-content-between' onKeyDown={handleKeyPress} style={{ marginLeft: 42, marginRight: 42, marginTop: 24 }}>
            <Form onSubmit={handleSubmit}>
                <div className="d-flex flex-row justify-content-between" style={{ width: '100%', textAlign: 'left' }}>
                    <div className="m-1">
                        <Form.Label>Vendor ID</Form.Label>
                        <Form.Group controlId="name_id">
                            <Form.Control
                                type="text"
                                name="name_id"
                                value={vendorData.name_id}
                                onChange={handleChange}
                                placeholder="Name"
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
                                placeholder="Country"
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
                                placeholder="%"
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
                                placeholder="%"
                                isInvalid={isFormValidated && !vendorData.exchange_rate_}
                                isValid={isFormValidated && vendorData.exchange_rate_}
                                required
                            />
                        </Form.Group>
                    </div>
                    <div className='m-1'>
                        <Form.Group controlId="vendor_tag">
                            <Form.Label>Vendor Tag</Form.Label>
                            <ButtonGroup style={{ width: '250px', height: '38px'}}>
                                {!showInput && (
                                    <Dropdown >
                                        <Dropdown.Toggle variant="light" id="dropdown-basic" className="align-items-baseline" style={{ width: '220px', height: '37px', textDecoration: 'none', fontSize: 18, textAlign: 'left' }}>
                                            {productPtr}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="align-dropdown-right">
                                            {vendorTag.map((tag, index) => (
                                                <Dropdown.Item key={index} onClick={handlePT(tag)}>
                                                    <div className="text-center">{tag}</div>
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                                {showInput && (
                                    <Form.Control
                                        type="string"
                                        name="vendor_tag"
                                        value={vendorData.vendor_tag}
                                        onChange={handleChange}
                                        onBlur={hadlePTBlur}
                                        placeholder="Search or Create"
                                        style={{ width: '280px', border: newPtColor ? '2px solid orange' : '' }}
                                    />
                                )}
                                <Button onClick={() => setShowInput(!showInput)}>^</Button>
                            </ButtonGroup>
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