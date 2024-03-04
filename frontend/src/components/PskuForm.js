import React, { useState, useRef, useEffect } from 'react';
import { Form, Col, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { useSkuForm } from './CskuForm';

const PskuForm = ({ pskuData, setPskuData, index, onRemove}) => {
    const { isFormValidated, setIsFormValidated, mySku, vendorData, isLoadingVendors, validateForm } = useSkuForm();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPskuData(prevData => prevData.map((item, i) => i === index ? { ...item, [name]: value } : item));
    };

    return (
        <div className="">
            <div className="row g-2 mt-1">
                <Col md={1}>
                    <Form.Group controlId="sku">
                        <Form.Control
                            type="text"
                            name="name_id"
                            value={pskuData.name_id}
                            onChange={handleChange}
                            placeholder="SKU  ID" />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group controlId="vendor_id" style={{ textAlign: 'left' }}>
                        <Form.Select
                            name="vendor_id"
                            onChange={handleChange}
                            value={pskuData.vendor_id}
                            required
                            isInvalid={isFormValidated && !pskuData.vendor_id}
                        >
                            {vendorData.map((vendor) => (
                                <option key={vendor.name_id} value={vendor.name_id}>
                                    {vendor.name_id}
                                </option>
                            ))}
                        </Form.Select>

                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group controlId="description">
                        <Form.Control
                            type="text"
                            name="description"
                            value={pskuData.description}
                            onChange={handleChange}
                            placeholder="Description" />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group controlId="cogs">
                        <Form.Control
                            type="text"
                            name="cogs"
                            value={pskuData.cogs}
                            onChange={handleChange}
                            placeholder="COGS" />
                    </Form.Group>
                </Col>
                <Col md={1}>
                    <Form.Group controlId="first_mile">
                        <InputGroup>
                            <Form.Control
                                type="number"
                                name="first_mile"
                                value={pskuData.first_mile}
                                onChange={handleChange}
                                placeholder="€" />
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col md={1}>
                    <Form.Group controlId="weight_kg">
                        <InputGroup>
                            <Form.Control
                                type="number"
                                name="weight_kg"
                                value={pskuData.weight_kg}
                                onChange={handleChange}
                                placeholder="KG" />
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col md={1}>
                    <Button
                        className='form-button'
                        id='del-button'
                        variant='danger'
                        style={{ opacity: 0.5, fontSize: '22px', height: 38}}
                        onClick={() => onRemove(index)}
                    >
                         <i className="bi bi-trash"></i>
                    </Button>
                </Col>
            </div>
        </div>
    );
};

export default PskuForm;