import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';
import { Form, Button, Col } from 'react-bootstrap';
import { useSkuForm } from './CskuForm'
import { SearchBar } from './SearchBar';


const GridPackaging = () => {
    const { vendorData, productTag } = useSkuForm();
    const [rowData, setRowData] = useState([])
    const [rowData2, setRowData2] = useState([])
    const [colData, setColData] = useState(
        [
            { headerName: 'Vendor ID', field: 'vendor_id', width: 150 },
            { headerName: 'Product Tag', field: 'product_tag', width: 150 },
            { headerName: 'Cost of Packaging Fee', field: 'cost_of_packaging', editable: true, width: 200 },
        ]
    )
    const [colData2, setColData2] = useState(
        [
            { headerName: 'Product Tag', field: 'product_tag', width: 150 },
            { headerName: 'Cost of Packaging Fee', field: 'cost_of_packaging', editable: true, width: 200 },
        ]
    )

    window.v = vendorData;
    window.pt = productTag

    const [sendVendorPackaging, setSendVendorPackaging] = useState({
        vendor_id: '',
        product_tag: '',
        cost_of_packaging: ''
    })

    const [sendWarehousePackaging, setSendWarehousePackaging] = useState({
        product_tag: '',
        cost_of_packaging: ''
    })

    useEffect(() => {
        const fetchPVendor = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/packagingvendor`)
                setRowData(response.data)
            }
            catch (error) {
                console.log('fetchPVendor threw an error, ', error);
            }
        }
        const fetchPWarehouse = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/packagingwarehouse`)
                setRowData2(response.data)
            }
            catch (error) {
                console.log('fetchPWarehouse threw an error, ', error);
            }
        }
        fetchPVendor()
        fetchPWarehouse()
    }, []);

    const handleInputChangeVendor = (fieldName, value) => {
        setSendVendorPackaging({ ...sendVendorPackaging, [fieldName]: value });
    };

    const handleInputChangeWarehouse = (fieldName, value) => {
        setSendWarehousePackaging({ ...sendWarehousePackaging, [fieldName]: value });
    };


    const handleSubmitVendor = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/packagingvendor', sendVendorPackaging);
            const fee = parseFloat(sendVendorPackaging.cost_of_packaging);
            if (response.status !== 202) {
                setRowData([...rowData, { ...sendVendorPackaging, cost_of_packaging: fee }]);
            }
            else {
                setRowData(rowData.map(item =>
                    item.vendor_id === sendVendorPackaging.vendor_id && item.product_tag === sendVendorPackaging.product_tag
                        ? { ...sendVendorPackaging, cost_of_packaging: fee }
                        : item
                ));
            }
            setSendVendorPackaging({
                vendor_id: '',
                product_tag: '',
                cost_of_packaging: ''
            });

        } catch (error) {
            alert('Call titorrito');
        }
    }

    const handleSubmitWarehouse = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/packagingwarehouse', sendWarehousePackaging);
            const fee = parseFloat(sendWarehousePackaging.cost_of_packaging);
            if (response.status === 202) {
                console.log('response.status', response.status);
                setRowData2(rowData2.map(item =>
                    item.product_tag === sendWarehousePackaging.product_tag
                    ? { ...sendWarehousePackaging, cost_of_packaging: fee }
                    : item
                    ));
                }
                else {
                console.log('response.status2', response.status);
                setRowData2([...rowData2, { ...sendWarehousePackaging, cost_of_packaging: fee }]);
            }
            setSendWarehousePackaging({
                product_tag: '',
                cost_of_packaging: ''
            });
        }
        catch (error) {
            alert('Call titorrito');
        }
    }

    return (
        <div className='mt-3 d-flex' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            <div className="ag-theme-quartz-dark" style={{ height: 800, width: 600, textAlign: 'left' }}>
                <h3>Vendor's Packaging Fees</h3>
                <AgGridReact
                    columnDefs={colData}
                    defaultColDef={{ flex: 1 }}
                    rowData={rowData}
                >
                </AgGridReact>
                <div style={{ width: '100%', height: '4em', marginTop: '1em', paddingRight: 20 }}>
                    <Form onSubmit={handleSubmitVendor}>
                        <div className="row g-2">
                            <Col md={4}>
                                <Form.Group controlId="vendor_id" style={{ textAlign: 'left' }}>
                                    <Form.Label className="form-label">Vendor's ID</Form.Label>
                                    <Form.Select
                                        name="vendor_id"
                                        value={sendVendorPackaging.vendor_id}
                                        onChange={(e) => handleInputChangeVendor('vendor_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Vendor</option>
                                        {vendorData.map((vendor) => (
                                            <option key={vendor.name_id} value={vendor.name_id}>
                                                {vendor.name_id}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="product_tag" style={{ textAlign: 'left' }}>
                                    <Form.Label className="form-label">Product Tag</Form.Label>
                                    <Form.Select
                                        name="product_tag"
                                        value={sendVendorPackaging.product_tag}
                                        onChange={(e) => handleInputChangeVendor('product_tag', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Product Tag</option>
                                        {productTag.map((tag) => (
                                            <option key={tag.id} value={tag.id}>
                                                {tag}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="cost_of_packaging" style={{ textAlign: 'left' }}>
                                    <Form.Label className="form-label">Packaging</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="cost_of_packaging"
                                        placeholder='Fee €'
                                        value={sendVendorPackaging.cost_of_packaging}
                                        onChange={(e) => handleInputChangeVendor('cost_of_packaging', e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={1} className="d-flex align-items-end">
                                <Button variant="primary" type="submit" style={{ height: '65px' }}>
                                    <i className='bi bi-plus-square-fill' ></i>
                                </Button>
                            </Col>
                        </div>
                    </Form>
                </div>
            </div>

            <div className="ag-theme-quartz-dark" style={{ height: 800, width: 400, textAlign: 'left' }}>
                <h3>Generic Packaging Fees</h3>
                <AgGridReact
                    columnDefs={colData2}
                    defaultColDef={{ flex: 1 }}
                    rowData={rowData2}>
                </AgGridReact>
                <div style={{ width: '100%', height: '4em', marginTop: '1em', paddingLeft: 5 }}>
                    <Form onSubmit={handleSubmitWarehouse}>
                        <div className="row g-2">
                            <Col md={5}>
                                <Form.Group controlId="product_tag" style={{ textAlign: 'left' }}>
                                    <Form.Label className="form-label">Product Tag</Form.Label>
                                    <Form.Select
                                        name="product_tag"
                                        value={sendWarehousePackaging.product_tag}
                                        onChange={(e) => handleInputChangeWarehouse('product_tag', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Product Tag</option>
                                        {productTag.map((tag) => (
                                            <option key={tag.id} value={tag.id}>
                                                {tag}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={5}>
                                <Form.Group controlId="cost_of_packaging" style={{ textAlign: 'left' }}>
                                    <Form.Label className="form-label">Packaging</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="cost_of_packaging"
                                        placeholder="Fee €"
                                        value={sendWarehousePackaging.cost_of_packaging}
                                        onChange={(e) => handleInputChangeWarehouse('cost_of_packaging', e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={1} className="d-flex align-items-end">
                                <Button variant="primary" type="submit" style={{ height: '65px' }}>
                                    <i className="bi bi-plus-square-fill"></i>
                                </Button>
                            </Col>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )

}

export default GridPackaging;