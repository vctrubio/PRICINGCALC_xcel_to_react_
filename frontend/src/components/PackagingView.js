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
    const [gridApi, setGridApi] = useState(null);
    const [gridApi2, setGridApi2] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRows2, setSelectedRows2] = useState([]);
    const [rowData, setRowData] = useState([])
    const [rowData2, setRowData2] = useState([])
    const [colData, setColData] = useState(
        [
            {
                headerName: 'Vendor ID', field: 'vendor_id', width: 150,
                checkboxSelection: true,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true
            },
            { headerName: 'Product Tag', field: 'product_tag', width: 150 },
            { headerName: 'Cost of Packaging Fee', field: 'cost_of_packaging', editable: true, width: 200 },
        ]
    )
    const [colData2] = useState(
        [
            {
                headerName: 'Product Tag', field: 'name_id', width: 150,
                checkboxSelection: true,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true
            },
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

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const onSelectionChanged = (param) => {
        setSelectedRows(gridApi.getSelectedRows());
    };

    const onRowClicked = (event) => {
        event.node.setSelected(!event.node.isSelected());
    };

    const handleCellValueChangedVendor = async (event) => {
        try {
            for (let key in event.data) {
                if (event.data[key] === undefined || event.data[key] === null) {
                    console.error(`Error: ${key} is empty`);
                    return;  // Exit the function if an empty field is found
                }
            }
            const response = await axios.patch(`http://localhost:8000/packagingvendor/${event.data.vendor_id}/${event.data.product_tag}`, event.data);
        }
        catch (error) {
            console.error('Error updating Vendor Packaging data:', error);
        }
    }

    const handleCellValueChangedWarehouse = async (event) => {
        try {
            for (let key in event.data) {
                if (event.data[key] === undefined || event.data[key] === null) {
                    console.error(`Error: ${key} is empty`);
                    return;  // Exit the function if an empty field is found
                }
            }
            const response = await axios.patch(`http://localhost:8000/packagingwarehouse/${event.data.product_tag}`, event.data);
        }
        catch (error) {
            console.error('Error updating Warehouse Packaging data:', error);
        }
    }

    const onGridReady2 = params => {
        setGridApi2(params.api);
    };

    const onSelectionChanged2 = (param) => {
        setSelectedRows2(gridApi2.getSelectedRows());
    };

    const onRowClicked2 = (event) => {
        event.node.setSelected(!event.node.isSelected());
    };

    const getrowId = (params) => {
        return params.data.name_id
    }

    return (
        <div className='mt-3 d-flex' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="ag-theme-quartz-dark" style={{ height: 700, width: 1270, textAlign: 'left' }}>
                <SearchBar title='PackagingWarehouse' titlecount={rowData2.length} data={rowData2} setData={setRowData2} selectedRows={selectedRows2}/>
                <AgGridReact
                    onGridReady={onGridReady2}
                    columnDefs={colData2}
                    getRowId={getrowId}
                    rowData={rowData2}
                    defaultColDef={{ flex: 1, filter: true, sortable: true, floatingFilter: true }}
                    onCellValueChanged={handleCellValueChangedWarehouse}
                    onSelectionChanged={onSelectionChanged2}
                    onRowClicked={onRowClicked2}
                    suppressRowClickSelection={true}
                    animateRows={true}
                    rowSelection={'multiple'}
                >
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