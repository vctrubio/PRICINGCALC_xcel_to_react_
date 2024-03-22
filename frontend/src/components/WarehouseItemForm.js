import React, { useEffect, useState } from 'react';
import { Form, Dropdown, ButtonGroup, Button, Col, Row } from 'react-bootstrap';
import { useSkuForm } from './CskuForm';


export const WarehouseItemForm = ({ whItem, setWhItem, index, onRemove, usableCDs }) => {
    const { productTag } = useSkuForm();

    const [showInput, setShowInput] = useState(false);
    const [newPtColor, setNewPtColor] = useState(false);
    const [productPtr, setProductPtr] = useState(
        localStorage.getItem('productTagItem') || productTag[0]
    );

    const [calc, setCalc] = useState('');

    useEffect(() => {
        let productTagItem = localStorage.getItem('productTagItem');
        setProductPtr(productTagItem);
        whItem.product_tag = productTagItem;
    }, [whItem.product_tag]);

    useEffect(() => {
        let total = (parseFloat(whItem.unit_fee) || 0) + (parseFloat(whItem.storage_fee) || 0) + (parseFloat(whItem.pick_and_pack_fee) || 0) + (parseFloat(whItem.custom_fee) || 0);
        setCalc(total)
    }, [whItem.unit_fee, whItem.storage_fee, whItem.pick_and_pack_fee, whItem.custom_fee])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWhItem(prevData => prevData.map((item, i) => i === index ? { ...item, [name]: name !== 'product_tag' ? Number(value) : value } : item));

    };

    const handlePT = (tag) => () => {
        localStorage.setItem('productTagItem', tag);
        setWhItem(prevData => prevData.map((item, i) => i === index ? { ...item, ['product_tag']: tag } : item));
    };

    const hadlePTBlur = (e) => {
        console.log('blur: ', e.target.value)
        localStorage.setItem('productTagItem', e.target.value);
        setWhItem(prevData => prevData.map((item, i) => i === index ? { ...item, ['product_tag']: e.target.value } : item));
        if (e.target.value && !productTag.includes(e.target.value))
            setNewPtColor(true)
        else
            setNewPtColor(false)
    };

    return (
        <form onSubmit={(event) => {
            event.preventDefault();
        }}>
            <Row className='p-2'>
                <Col md={3}>
                    <Form.Group controlId="productTag" style={{ textAlign: 'left' }}>
                        <ButtonGroup style={{ width: '300px', height: '38px', paddingBottom: 1 }}>
                            {!showInput && (
                                <Dropdown >
                                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="align-items-baseline" style={{ width: '256px', height: '37px', textDecoration: 'none', fontSize: 18, textAlign: 'left' }}>
                                        {productPtr}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="align-dropdown-right">
                                        {productTag.map((tag, index) => (
                                            <Dropdown.Item key={index} onClick={handlePT(tag)}>
                                                <div className="text-center">{tag}</div>
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                            {showInput && (
                                <Form.Control
                                    type="text"
                                    name="product_tag"
                                    value={whItem.product_tag}
                                    onChange={handleChange}
                                    onBlur={hadlePTBlur}
                                    placeholder="Search or Create your own"
                                    style={{ width: '280px', border: newPtColor ? '2px solid orange' : '' }}
                                />
                            )}
                            <Button onClick={() => setShowInput(!showInput)}>^</Button>
                        </ButtonGroup>
                    </Form.Group>
                </Col>

                <Col md={2}>
                    <Form.Group controlId="unit_fee">
                        <Form.Control
                            type="number"
                            name="unit_fee"
                            value={whItem.unit_fee}
                            onChange={handleChange}
                            placeholder="Unit Fee"
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group controlId="storage_fee">
                        <Form.Control
                            type="number"
                            name="storage_fee"
                            value={whItem.storage_fee}
                            onChange={handleChange}
                            placeholder="Storage Fee"
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group controlId="pick_and_pack_fee">
                        <Form.Control
                            type="number"
                            name="pick_and_pack_fee"
                            value={whItem.pick_and_pack_fee}
                            onChange={handleChange}
                            placeholder="Pick and Pack Fee"
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group controlId="custom_fee">
                        <Form.Control
                            type="number"
                            name="custom_fee"
                            value={whItem.custom_fee}
                            onChange={handleChange}
                            placeholder="Custom Fee"
                        />
                    </Form.Group>
                </Col>
                <Col md={1}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', height: 38, marginLeft: 0 }}>
                        <Button
                            variant="dark"
                            onClick={onRemove}
                            style={{ paddingTop: 0, width: 50, marginLeft: 2 }}
                        >
                            <i className="bi bi-trash"></i>
                        </Button>
                    </div>
                </Col>
            </Row >
        </form>
    );
}
