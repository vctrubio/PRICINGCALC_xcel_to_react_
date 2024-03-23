import React, { useCallback, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';

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
        return dataArray;
    } catch (error) {
        console.error('There was a BIGFAT error!', error);
    }
}

const GridVendor = () => {
    const [gridApi, setGridApi] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [rowData, setRowData] = useState([])
    const [gridKey] = useState(1);
    const [colData] = useState(
        [
            {
                headerName: 'Vendor ID', field: 'name_id',
                checkboxSelection: true,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true
            },
            { headerName: 'Origin', field: 'origin', editable: true },
            { headerName: 'PP Rate', field: 'pp_rate_', editable: true, valueFormatter: params => `${params.value}%` },
            { headerName: 'Ex Rate', field: 'exchange_rate_', editable: true, valueFormatter: params => `${params.value}%` },
        ]
    )

    useEffect(() => {

        
        const fetchData = async () => {
            const data = await getData('vendor');
            setRowData(data);
            if (gridApi) {
                gridApi.setRowData(data);
                console.log('data is: ', data);
                gridApi.refreshCells({ force: true });
            }
        };
        fetchData();
    }, []);

    const updateVendorData = useCallback((param) => {
        setRowData([param, ...rowData])
    })

    const handleCellValueChanged = async (event) => {
        try {
            for (let key in event.data) {
                if (event.data[key] === undefined || event.data[key] === null) {
                    console.error(`Error: ${key} is empty`);
                    return;
                }
            }
            const response = await axios.patch(`http://localhost:8000/vendor/${event.data.name_id}`, event.data);
        } catch (error) {
            console.error('Error updating Vendor data:', error);
        }
    }

    const getrowId = useCallback(params => {
        return params.data.name_id
    })

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const onSelectionChanged = (param) => {
        setSelectedRows(gridApi.getSelectedRows());
    };

    const onRowClicked = (event) => {
        event.node.setSelected(!event.node.isSelected());
    };

    return (
        <div className="ag-theme-quartz-dark" style={{ height: '70vh', width: 1270 }}>
            <SearchBar title='Vendor' titlecount={rowData.length} search={search} setSearch={setSearch} data={rowData} setData={setRowData} selectedRows={selectedRows}  />
            <AgGridReact
                key={gridKey}
                onGridReady={onGridReady}
                getRowId={getrowId}
                columnDefs={colData}
                rowData={rowData}
                defaultColDef={{ flex: 1, filter: true, sortable: true, floatingFilter: true }}
                onCellValueChanged={handleCellValueChanged}
                onSelectionChanged={onSelectionChanged}
                onRowClicked={onRowClicked}
                suppressRowClickSelection={true}
                animateRows={false}
                rowSelection={'multiple'}
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