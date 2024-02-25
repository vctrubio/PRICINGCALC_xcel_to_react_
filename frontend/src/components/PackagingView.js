import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';
import Form from 'react-bootstrap/Form';

import { getData } from './CskuForm';
import { SearchBar } from './SearchBar';

// const PackagingForm = ({ updatePackaging, rowData, onClose }) => {
//     return (
//         <div>
//             <div className='d-flex flex-row flex-start justify-content-between' onKeyDown={handleKeyPress} style={{ marginLeft: 42, marginRight: 42, marginTop: 24}}>
//                 <Form onSubmit={handleSubmit}>
//                     <div className="d-flex flex-row justify-content-between" style={{ width: '100%' }}>
//                         <div className="m-1">
//                             <Form.Label>Product ID</Form.Label>
//                             <Form.Group controlId="product_id">
//                                 <Form.Control
//                                     type="text"
//                                     name="product_id"
//                                     value={productData.product_id}
//                                     onChange={handleChange}
//                                     placeholder="Enter Product ID"
//                                     isInvalid={isFormValidated && !productData.product_id}
//                                     isValid={isFormValidated && productData.product_id}
//                                     style={{ backgroundColor: isValidName ? 'white' : 'rgba(225, 0, 0, 0.6)' }}
//                                     required
//                                 />
//                             </Form.Group>
//                         </div>
//                         <div className="m-1">
//                             <Form.Group controlId="manufacturer">
//                                 <Form.Label>Manufacturer</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     name="manufacturer"
//                                     value={productData.manufacturer}
//                                     onChange={handleChange}
//                                     placeholder="Enter Manufacturer"
//                                     isInvalid={isFormValidated && !productData.manufacturer}
//                                     isValid={isFormValidated && productData.manufacturer}
//                                     required
//                                 />
//                             </Form.Group>
//                         </div>
//                         <div className='m-1'>
//                             <Form.Group controlId="price">
//                                 <Form.Label>Price</Form.Label>
//                                 <Form.Control
//                                     type="number"
//                                     name="price"
//                                     value={productData.price}
//                                     onChange={handleChange}
//                                     placeholder="Enter Price"
//                                     isInvalid={isFormValidated && !productData.price}
//                                     isValid={isFormValidated && productData.price}
//                                     required
//                                 />
//                             </Form.Group>
//                         </div>
//                         <div className='m-1'>
//                             <Form.Group controlId="stock">
//                                 <Form.Label>Stock</Form.Label>
//                                 <Form.Control
//                                     type="number"
//                                     name="stock"
//                                     value={productData.stock}
//                                     onChange={handleChange}
//                                     placeholder="Enter Stock"
//                                     isInvalid={isFormValidated && !productData.stock}
//                                     isValid={isFormValidated && productData.stock}
//                                     required
//                                 />
//                             </Form.Group>
//                         </div>
//                     </div>
//                 </Form>
//                 <Button variant="primary" type="submit" onClick={handleSubmit} className='mb-1 mt-1'>
//                     Submit
//                 </Button>
//             </div>
//         </div>
//     )
//  } 




const GridPackaging = () => {
    const [search, setSearch] = useState('');
    const [rowData, setRowData] = useState([])
    const [showForm, setShowForm] = useState(false);
    const [colData, setColData] = useState(
        [
            { headerName: 'ID', field: 'int_id', maxWidth: 60 },
            { headerName: 'Product Tag', field: 'product_tag', width: 150 },
            { headerName: 'Dim Weight', field: 'dim_weight', editable: true, width: 200 },
            { headerName: 'Cost of Packaging Fee', field: 'cost_of_packaging', editable: true, width: 200 },
        ]
    )

    useEffect(() => {
        getData('packaging', 'value').then(data => {
            setRowData(data)
        });
    }, []);
    const rowData2 = [
        { "VendorID": "ZenZone", "ProductTag": "Bed Set", "DimWeight": 25, "CostOfPackaging": 12.5 },
        { "VendorID": "ZenZone", "ProductTag": "Pillow Set", "DimWeight": 15, "CostOfPackaging": 9.7 },
        { "VendorID": "ZenZone", "ProductTag": "Mattress Set", "DimWeight": 35, "CostOfPackaging": 15.2 },
        { "VendorID": "ZenZone", "ProductTag": "Bedding", "DimWeight": 20, "CostOfPackaging": 11.8 },
        { "VendorID": "ZenZone", "ProductTag": "Mattress", "DimWeight": 40, "CostOfPackaging": 16.5 },
        { "VendorID": "DreamCraft", "ProductTag": "Bed Set", "DimWeight": 26, "CostOfPackaging": 13.7 },
        { "VendorID": "DreamCraft", "ProductTag": "Pillow Set", "DimWeight": 18, "CostOfPackaging": 10.3 },
        { "VendorID": "DreamCraft", "ProductTag": "Mattress Set", "DimWeight": 38, "CostOfPackaging": 16.1 },
        { "VendorID": "DreamCraft", "ProductTag": "Bedding", "DimWeight": 23, "CostOfPackaging": 12.2 },
        { "VendorID": "DreamCraft", "ProductTag": "Mattress", "DimWeight": 42, "CostOfPackaging": 17.3 },
        { "VendorID": "CozyNest", "ProductTag": "Bed Set", "DimWeight": 24, "CostOfPackaging": 12.1 },
        { "VendorID": "CozyNest", "ProductTag": "Pillow Set", "DimWeight": 20, "CostOfPackaging": 11.2 },
        { "VendorID": "CozyNest", "ProductTag": "Mattress Set", "DimWeight": 40, "CostOfPackaging": 16.6 },
        { "VendorID": "CozyNest", "ProductTag": "Bedding", "DimWeight": 25, "CostOfPackaging": 13.4 },
        { "VendorID": "CozyNest", "ProductTag": "Mattress", "DimWeight": 45, "CostOfPackaging": 17.8 },
        { "VendorID": "EuroDream", "ProductTag": "Bed Set", "DimWeight": 25, "CostOfPackaging": 12.8 },
        { "VendorID": "EuroDream", "ProductTag": "Pillow Set", "DimWeight": 22, "CostOfPackaging": 11.7 },
        { "VendorID": "EuroDream", "ProductTag": "Mattress Set", "DimWeight": 42, "CostOfPackaging": 17.4 },
        { "VendorID": "EuroDream", "ProductTag": "Bedding", "DimWeight": 27, "CostOfPackaging": 13.7 },
        { "VendorID": "EuroDream", "ProductTag": "Mattress", "DimWeight": 47, "CostOfPackaging": 18.9 },
        { "VendorID": "SilkSleep", "ProductTag": "Bed Set", "DimWeight": 26, "CostOfPackaging": 13.5 },
        { "VendorID": "SilkSleep", "ProductTag": "Pillow Set", "DimWeight": 25, "CostOfPackaging": 12.1 },
        { "VendorID": "SilkSleep", "ProductTag": "Mattress Set", "DimWeight": 45, "CostOfPackaging": 18.2 },
        { "VendorID": "SilkSleep", "ProductTag": "Bedding", "DimWeight": 30, "CostOfPackaging": 14.6 },
        { "VendorID": "SilkSleep", "ProductTag": "Mattress", "DimWeight": 50, "CostOfPackaging": 19.5 },
        { "VendorID": "CloudNest", "ProductTag": "Bed Set", "DimWeight": 24, "CostOfPackaging": 12.7 },
        { "VendorID": "CloudNest", "ProductTag": "Pillow Set", "DimWeight": 28, "CostOfPackaging": 13.5 },
        { "VendorID": "CloudNest", "ProductTag": "Mattress Set", "DimWeight": 48, "CostOfPackaging": 18.8 },
        { "VendorID": "CloudNest", "ProductTag": "Bedding", "DimWeight": 33, "CostOfPackaging": 15.9 },
        { "VendorID": "CloudNest", "ProductTag": "Mattress", "DimWeight": 53, "CostOfPackaging": 20.7 },
        { "VendorID": "BalticDream", "ProductTag": "Bed Set", "DimWeight": 25, "CostOfPackaging": 13.1 },
        { "VendorID": "BalticDream", "ProductTag": "Pillow Set", "DimWeight": 30, "CostOfPackaging": 14.7 },
        { "VendorID": "BalticDream", "ProductTag": "Mattress Set", "DimWeight": 50, "CostOfPackaging": 19.6 },
        { "VendorID": "BalticDream", "ProductTag": "Bedding", "DimWeight": 35, "CostOfPackaging": 16.5 },
        { "VendorID": "BalticDream", "ProductTag": "Mattress", "DimWeight": 55, "CostOfPackaging": 21.8 },
        { "VendorID": "CozyDream", "ProductTag": "Bed Set", "DimWeight": 26, "CostOfPackaging": 13.8 },
        { "VendorID": "CozyDream", "ProductTag": "Pillow Set", "DimWeight": 32, "CostOfPackaging": 15.3 },
        { "VendorID": "CozyDream", "ProductTag": "Mattress Set", "DimWeight": 52, "CostOfPackaging": 20.4 },
        { "VendorID": "CozyDream", "ProductTag": "Bedding", "DimWeight": 37, "CostOfPackaging": 17.1 },
        { "VendorID": "CozyDream", "ProductTag": "Mattress", "DimWeight": 57, "CostOfPackaging": 22.3 },
        { "VendorID": "SlumberSolutions", "ProductTag": "Bed Set", "DimWeight": 25, "CostOfPackaging": 13.2 },
        { "VendorID": "SlumberSolutions", "ProductTag": "Pillow Set", "DimWeight": 34, "CostOfPackaging": 16.5 },
    ]

    const colData2 = [
        { headerName: 'VendorID', field: 'VendorID', width: 150 },
        { headerName: 'ProductTag', field: 'ProductTag', width: 150 },
        { headerName: 'DimWeight', field: 'DimWeight', width: 150 },
        { headerName: 'CostOfPackaging', field: 'CostOfPackaging', width: 150 },
    ]

    window.packagin = rowData;

    return (
        <div>
            <div className="ag-theme-quartz-dark" style={{ height: 300, width: 1270 }}>
                <SearchBar title='Packaging' titlecount={rowData.length} search={search} setSearch={setSearch} />

                <AgGridReact
                    columnDefs={colData}
                    defaultColDef={{ flex: 1 }}

                    rowData={rowData}>
                </AgGridReact>

                <div className=" mt-4 ag-theme-quartz-dark" style={{ height: 800, width: 1270 }}>

                    <AgGridReact
                        columnDefs={colData2}
                        defaultColDef={{ flex: 1 }}
                        rowData={rowData2}>
                    </AgGridReact>
                </div>
            </div>

        </div>
    )

}

export default GridPackaging;