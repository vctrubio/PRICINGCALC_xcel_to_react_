import React, { useEffect, useMemo, useState } from 'react'
import { Form, Button } from 'react-bootstrap';

import axios from 'axios'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';
import VendorForm from './VendorForm'
import { SearchBar } from './SearchBar';

async function getData(model) {
    try {
        const response = await axios.get(`http://localhost:8000/${model}`);
        const dataArray = Object.values(response.data);
        window.ptr = dataArray;
        console.log(model, ' Data from API:', dataArray);
        return dataArray;
    } catch (error) {
        console.error('There was a BIGFAT error!', error);
    }
}


const GridVendor = () => {
    const [search, setSearch] = useState('');
    const [rowData, setRowData] = useState([])
    const [colData, setColData] = useState(
        [
            { headerName: 'Vendor ID', field: 'name_id' },
            { headerName: 'Origin', field: 'origin', editable: true },
            { headerName: 'PP Rate', field: 'pp_rate_', editable: true, valueFormatter: params => `${params.value}%` },
            { headerName: 'Ex Rate', field: 'exchange_rate_', editable: true, valueFormatter: params => `${params.value}%` },
        ]
    )

    const [showForm, setShowForm] = useState(false);
    window.row = rowData

    useEffect(() => {
        getData('vendor').then(data => {
            setRowData(data);
        });
    }, []);

    const updateVendorData = async () => {
        try {
            const updatedData = await getData('vendor');
            setRowData(updatedData);
        } catch (error) {
            console.error('Error updating Vendor data:', error);
            // Handle error appropriately (e.g., display a message)
        }
    }

    const handleCellValueChanged = async (event) => {
        try {
            for (let key in event.data) {
                if (event.data[key] === undefined || event.data[key] === null) {
                    console.error(`Error: ${key} is empty`);
                    return;  // Exit the function if an empty field is found
                }
            }
            const response = await axios.patch(`http://localhost:8000/vendor/${event.data.name_id}`, event.data);
        } catch (error) {
            console.error('Error updating Vendor data:', error);
            // Handle error appropriately (e.g., display a message)
        }
    }

    return (
        // style={{ height: 800, width: 1270 }}>
        <div className="ag-theme-quartz-dark maincontent" style={{ height: '70vh', width: 1270 }}>
            <SearchBar title='Vendor' titlecount={rowData.length} search={search} setSearch={setSearch} data={rowData} />
            <AgGridReact
                columnDefs={colData}
                rowData={rowData}
                defaultColDef={{ flex: 1 }}
                onCellValueChanged={handleCellValueChanged}
            />
            <div className='mt-4'>
                <Button variant={showForm ? "dark" : "primary"} onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Vendor' : 'New Vendor'}
                </Button>
                {showForm && <VendorForm addVendor={updateVendorData} rowData={rowData} onClose={() => setShowForm(false)} />}
            </div>
        </div >
    )

}

export default GridVendor;