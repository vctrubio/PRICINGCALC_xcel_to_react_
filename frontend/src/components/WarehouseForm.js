import React, { useEffect, useState } from 'react';
import { Form, Dropdown, ButtonGroup, Button, Col, Row } from 'react-bootstrap';
import { useSkuForm, getData } from './CskuForm';
import { WarehouseItemForm } from './WarehouseItemForm';
import axios from 'axios';

export const WhItem =
{
    product_tag: '',
    unit_fee: '',
    storage_fee: '',
    pick_and_pack_fee: ''
}

export const useWarehouseData = () => {
    const [allWh, setAllWh] = useState({});

    useEffect(() => {
        const fetch = async () => {
            try {
                const [wh] = await Promise.all([
                    getData('warehouse', 'value'),
                ]);

                const tempWh = wh.reduce((acc, warehouse) => {
                    const warehouseId = Object.values(warehouse)[0].name_id;
                    acc[warehouseId] = warehouse;
                    return acc;
                }, {});
                setAllWh(tempWh)
            }
            catch (error) {
                console.error('Error getWarehouse API', error);
            }
        }
        fetch()
    }, []);

    return [allWh, setAllWh];
};
const WarehouseForm = ({ addWh }) => {
    const { getData, productTag } = useSkuForm();
    const [whId, setWhId] = useState([]);
    const [allWh, setAllWh] = useWarehouseData();


    const [showInputId, setShowInputId] = useState(false);
    const [showInputOrigin, setShowInputOrigin] = useState(false);
    const [approvedWh, setApprovedWh] = useState(false);
    const [newWhColor, setNewWhColor] = useState(false);
    const [newOriginColor, setNewOriginColor] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [whData, setWhData] = useState([])

    const [whIdentity, setWhIdentity] = useState({
        name_id: localStorage.getItem('ptrWhNameId') || '',
        origin: '',
    });

    window.pick = allWh



    useEffect(() => {
        if (whIdentity.name_id)
            localStorage.setItem('ptrWhNameId', whIdentity.name_id);

        if (whIdentity.name_id && whIdentity.origin) {
            setApprovedWh(true);
        }
        else
            setApprovedWh(false);
    }, [whIdentity]);

    const setEmptywhData = () => {
        setWhData([]);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'wh_id') {
            setWhIdentity({ ...whIdentity, name_id: value });
        }
        if (name === 'wh_origin') {
            setWhIdentity({ ...whIdentity, origin: value });
        }

    };

    const resestWhatWasSubmitted = () => {
        setWhIdentity({ name_id: localStorage.getItem('ptrWhNameId'), origin: '' });
        setWhData([]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (whId[whIdentity.name_id] !== whIdentity.origin && whId[whIdentity.name_id]) {
        //     setShowSuccessMessage(true);
        //     setTimeout(() => {
        //         setShowSuccessMessage(false);
        //     }, 3000);
        //     return
        // }

        try {
            const do_response = async (form) => {
                const response = await axios.post('http://localhost:8000/warehouse', form);
                if (addWh)
                    addWh(form);
            }

            const whDataWithIdentity = whData.map(data => ({ ...whIdentity, ...data }));

            for (let i = 0; i < whDataWithIdentity.length; i++) {
                do_response((whDataWithIdentity[i]));
            }
            resestWhatWasSubmitted();
        }
        catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddWhData = (e) => {
        setWhData(prevWhData => [...prevWhData, WhItem]);
    }

    const handleDropDownBlur = (e) => {
        const { name, value } = e.target;
        if (e.target.value === '') {
            setNewWhColor(false);
            setNewOriginColor(false);
            return
        }

        if (name === 'wh_id') {
            let targetExists = Object.keys(allWh).includes(value);

            if (targetExists) {
                // console.log('targetExistsme: .....', targetExists)
                setNewWhColor(false);
            }
            else {
                console.log('.. ', Object.keys(allWh).includes(value))
                setNewWhColor(true)
            }
        }


        else if (name === 'origin_id') {
            const found = Object.values(allWh[whIdentity.name_id]).some(nestedDict => nestedDict.origin === value);
            setNewOriginColor(found);
        }
    }

    window.color = newOriginColor
    window.wh = whIdentity;
    window.all = whData;
    window.ids = whId

    const handleDropDownChange = (e) => {
        const { name, value } = e.target;
        if (name === 'wh_id') {
            setWhIdentity({ ...whIdentity, name_id: value });
            localStorage.setItem('ptrWhNameId', JSON.stringify(value));
        }
        if (name === 'origin_id') {
            setWhIdentity({ ...whIdentity, origin: value });
        }
    };


    return (
        <div className="mt-2 border rounded-top border-secondary p-2">
            {showSuccessMessage && (
                <div className="alert alert-warning mt-2" role="alert">
                    <p style={{ fontWeight: 'bold', fontSize: '2em' }}>  Warehouse ID ≠ {whId[whIdentity.name_id]}</p>
                </div>
            )}
            <div className="row g-3">
                <div>
                    <Row tabIndex="0" className='d-flex justify-content-between w-100'>
                        <div className='d-flex justify-content-between'>
                            <div className='d-flex justify-content-around mb-2'>
                                <div className='' style={{ marginRight: 8 }}>
                                    <h6 style={{ textAlign: 'left' }}>Warehouse ID</h6>

                                    <ButtonGroup style={{ width: '300px', height: '40px', paddingBottom: 2 }}>
                                        {!showInputId && (

                                            <Dropdown >
                                                <Dropdown.Toggle variant="light" id="dropdown-basic" className="align-items-baseline" style={{ width: '256px', height: '38px', textDecoration: 'none', fontSize: 18, textAlign: 'left' }}>
                                                    {whIdentity.name_id}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="align-dropdown-right">
                                                    {Object.keys(allWh).map((key, index) => (
                                                        <Dropdown.Item key={index}
                                                            onClick={() => setWhIdentity({ ...whIdentity, name_id: key })}
                                                        >
                                                            <div className="text-center">{key}</div>
                                                        </Dropdown.Item>
                                                    ))}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        )}
                                        {showInputId && (
                                            <Form.Control
                                                type="text"
                                                name="wh_id"
                                                onChange={handleDropDownChange}
                                                onBlur={handleDropDownBlur}
                                                placeholder="Search or Create Warehouse"
                                                style={{ width: '280px', border: !newWhColor ? '' : '2px solid orange' }}
                                            />
                                        )}
                                        <Button onClick={() => setShowInputId(!showInputId)}>^</Button>
                                    </ButtonGroup>

                                </div>

                                {
                                    whIdentity.name_id && (

                                        <div className='' style={{ marginRight: 8 }}>
                                            <h6 style={{ textAlign: 'left' }}>Origin</h6>
                                            <ButtonGroup style={{ width: '250px', height: '40px', paddingBottom: 2 }}>
                                                {!showInputOrigin && (
                                                    <Dropdown >
                                                        <Dropdown.Toggle variant="light" id="dropdown-basic" className="align-items-baseline" style={{ width: '206px', height: '38px', textDecoration: 'none', fontSize: 18, textAlign: 'left' }}>

                                                            {whIdentity.origin}
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu className="align-dropdown-right">
                                                            {Object.keys(allWh).map((key, index) => {
                                                                if (key === whIdentity.name_id) {
                                                                    const innerKeys = Object.keys(allWh[key]);
                                                                    const uniqueOrigins = [...new Set(innerKeys.map(innerKey => allWh[key][innerKey].origin))];
                                                                    return uniqueOrigins.map((origin, originIndex) => (
                                                                        <Dropdown.Item key={originIndex}
                                                                            onClick={() => setWhIdentity({ ...whIdentity, origin: origin })}
                                                                        >
                                                                            <div className="text-center">{origin}</div>
                                                                        </Dropdown.Item>
                                                                    ));
                                                                }
                                                                return null;
                                                            })}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                )}

                                                {showInputOrigin && (
                                                    <Form.Control
                                                        type="text"
                                                        name="origin_id"
                                                        onChange={handleDropDownChange}
                                                        onBlur={handleDropDownBlur}
                                                        placeholder="Origin"
                                                        style={{ width: '280px', border: newOriginColor ? '' : '2px solid orange' }}
                                                    />
                                                )}
                                                <Button onClick={() => setShowInputOrigin(!showInputOrigin)}>^</Button>
                                            </ButtonGroup>

                                        </div>
                                    )
                                }



                            </div>

                            <div className='pt-3'>

                                {whData.length > 0 && (
                                    <Button variant="dark" className="me-3" onClick={setEmptywhData}>
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                )}
                                {approvedWh && (
                                    <Button variant="secondary" className="me-3" onClick={handleAddWhData}>
                                        Add Fees
                                    </Button>
                                )}
                                <Button variant="primary" type="submit" onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </Row>
                </div>

                {whData.map((ptr, index) => {
                    const handleRemove = () => {
                        setWhData(prevData => prevData.filter((_, i) => i !== index));
                    }
                    return (
                        <WarehouseItemForm
                            key={index}
                            whItem={ptr}
                            setWhItem={setWhData}
                            index={index}
                            onRemove={handleRemove}
                            whData={whData}
                        />
                    );
                })}

            </div>
        </div>
    );
};

export default WarehouseForm;
