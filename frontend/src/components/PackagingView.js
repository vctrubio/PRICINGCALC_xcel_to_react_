import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';
import Form from 'react-bootstrap/Form';

import { SearchBar } from './SearchBar';

/* tudus
set new row at the top
get product tags
if product tag exist, with vendor id or not, ask first, then action
*/


const GridPackaging = () => {
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

    useEffect(() => {
        const fetchPVendor = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/packagingvendor`)
                console.log('hill...', response.data)
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

    var inputRow = {};

    return (
        <div className='mt-3 d-flex' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="ag-theme-quartz-dark" style={{ height: 800, width: 600, textAlign: 'left' }}>
                <h3>Vendor's Packaging Fees</h3>
                <AgGridReact
                    columnDefs={colData}
                    defaultColDef={{ flex: 1 }}
                    rowData={rowData}
                    pinnedTopRowData={[{ col1: 'Top 1', col2: 'Top 2', col3: 'Top 3' }]}
                >
                </AgGridReact>
            </div>

            <div className="ag-theme-quartz-dark" style={{ height: 800, width: 400, textAlign: 'left' }}>
                <h3>Generic Packaging Fees</h3>
                <AgGridReact
                    columnDefs={colData2}
                    defaultColDef={{ flex: 1 }}
                    rowData={rowData2}>
                </AgGridReact>
            </div>
        </div>
    )

}

export default GridPackaging;