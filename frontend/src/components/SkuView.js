import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';

import { SkuForm } from './SkuForm';
import { SearchBar } from './SearchBar';


async function getData(model) {
    try {
        const response = await axios.get(`http://localhost:8000/${model}`);
        const dataArray = Object.values(response.data);
        window.ptr = dataArray;
        return dataArray;
    } catch (error) {
        console.error('There was a BIGFAT error!', error);
    }
}



const GridTwo = () => {
    const [search, setSearch] = useState('');
    const [rowData, setRowData] = useState([])
    const [colData, setColData] = useState(
        [
            { headerName: 'Vendor ID', field: 'vendor_id', width: 140 },
            { headerName: 'SKU ID', field: 'name_id', width: 140 },
            { headerName: 'Description', field: 'description', editable: true, width: 300 },
            { headerName: 'COGS', field: 'cogs', editable: true, width: 100 },
            { headerName: 'First Mile', field: 'first_mile', editable: true, width: 100 },
            { headerName: 'Weight KG', field: 'weight_kg', editable: true, width: 110 },
            { headerName: 'PP Supplier', field: '_pp_supplier', width: 120, valueFormatter: params => `${parseFloat(params.value).toFixed(2)}` },
            { headerName: 'Exchange Fee', field: '_exchange_fee', width: 120, valueFormatter: params => `${parseFloat(params.value).toFixed(2)}` },
            { headerName: 'Total', field: '_total_cost', width: 150, valueFormatter: params => `${parseFloat(params.value).toFixed(2)}` },
        ]
    )

    window.row = rowData
    const updateSkuData = async () => {
        try {
            const updatedData = await getData('sku');
            setRowData(updatedData);
        } catch (error) {
            console.error('Error updating SKU data:', error);
            // Handle error appropriately (e.g., display a message)
        }
    };

    const [showAddVendor, setShowAddVendor] = useState(false);

    useEffect(() => {
        getData('sku').then(data => {
            setRowData(data);
        });
    }, []);

    window.test = rowData
    const handleCellValueChanged = async (event) => {
        try {
            for (let key in event.data) {
                if (event.data[key] === undefined || event.data[key] === null) {
                    console.error(`Error: ${key} is empty`);
                    return;  // Exit the function if an empty field is found
                }
            }
            const response = await axios.patch(`http://localhost:8000/sku/${event.data.name_id}`, event.data);
        } catch (error) {
            console.error('Error updating SKU data:', error);
            // Handle error appropriately (e.g., display a message)
        }
    }

    return (
        <div className="ag-theme-quartz-dark" style={{ height: '68vh', width: 1270 }}>

            <SearchBar title='SKU' titlecount={rowData.length} search={search} setSearch={setSearch} data={rowData} />
            <AgGridReact
                enableCellChangeFlash={true}
                columnDefs={colData}
                defaultColDef={{ flex: 1 }}
                rowData={rowData}
                onCellValueChanged={handleCellValueChanged}
            >
            </AgGridReact>
            <SkuForm addSku={updateSkuData} rowData={rowData} />
        </div>
    )
}

export default GridTwo;