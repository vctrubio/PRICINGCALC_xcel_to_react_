import React, { useEffect, useState } from 'react';
import { Form, Dropdown, ButtonGroup, Button, Col, Row } from 'react-bootstrap';
import { useSkuForm, getData } from './CskuForm';
import { WarehouseItemForm } from './WarehouseItemForm';
import axios from 'axios';

export const WhItem =
{
    unit_fee: '',
    storage_fee: '',
    pick_and_pack_fee: '',
    custom_fee: ''
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
                    const warehouseId = Object.values(warehouse)[0].name_id; //TODO ... its actually ok. its just an empty dict
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
    const [whId, setWhId] = useState([]);
    const [allWh, setAllWh] = useWarehouseData();


    const [showInputId, setShowInputId] = useState(false);
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
    window.color = newOriginColor
    window.wh = whIdentity;
    window.all = whData;
    window.ids = whId

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

        try {
            const do_response = async (form) => {
                const response = await axios.post('http://localhost:8000/warehouse', form);
                if (addWh)
                    addWh(form);
            }

            const isWhDataValid = whData.every(data =>
                data.unit_fee >= 0 && data.unit_fee !== '' &&
                data.storage_fee >= 0 && data.storage_fee !== '' &&
                data.pick_and_pack_fee >= 0 && data.pick_and_pack_fee !== '' &&
                data.custom_fee >= 0 && data.custom_fee !== ''
            );
            if (!isWhDataValid) {
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 3000);
                return;
            }
            const whDataWithIdentity = whData.map(data => ({ ...whIdentity, ...data }));

            await Promise.all(whDataWithIdentity.map(do_response));

            resestWhatWasSubmitted();
        }
        catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddWhData = () => {
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
                setNewWhColor(false);
            }
            else {
                setNewWhColor(true)
            }
        }
    }

    const handleDropDownChange = (e) => {
        const { name, value } = e.target;
        if (name === 'wh_id') {
            setWhIdentity({ ...whIdentity, name_id: value });
            localStorage.setItem('ptrWhNameId', JSON.stringify(value));
        }

    };

    return (
        <div className="mt-2 border rounded-top border-secondary p-2">
            {showSuccessMessage && (
                <div className="alert alert-warning mt-2" role="alert">
                    <p style={{ fontWeight: 'bold', fontSize: '2em' }}>  Warehouse Item Fees Missing. {whId[whIdentity.name_id]}</p>
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
                                        {/* <Button onClick={() => setShowInputId(!showInputId)}>^</Button> */}
                                    </ButtonGroup>
                                </div>
                            </div>

                            <div className='pt-3'>
                                {whData.length > 0 && (
                                    <Button variant="dark" className="me-3" onClick={setEmptywhData}>
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                )}
                                <Button variant="secondary" className="me-3" onClick={handleAddWhData}>
                                    Add Fees
                                </Button>
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
