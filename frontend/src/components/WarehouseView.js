import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';

import { SearchBar } from './SearchBar'
import WarehouseForm from './WarehouseForm'

async function getData(model) {
    try {
        const response = await axios.get(`http://localhost:8000/${model}`);
        return response.data;
    } catch (error) {
        console.error('There was a BIGFAT error!', error);
    }
}


const GridWarehouse = () => {
    const [gridApi, setGridApi] = useState(null);
    const [rerender, setRerender] = useState(false)
    const [selectedRows, setSelectedRows] = useState([]);
    const [search, setSearch] = useState('');
    const [rowData, setRowData] = useState([])
    const [colData, setColData] = useState(
        [
            {
                headerName: 'WH ID', field: 'name_id', minWidth: 300,
                checkboxSelection: true,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true
            },
            { headerName: 'Product Tag', field: 'product_tag', width: 200 }, //dropdown for selecting product tag to do 
            {
                headerName: 'Fees', children: [
                    { headerName: 'Unit', field: 'unit_fee', editable: true, maxWidth: 100 },
                    { headerName: 'Storage', field: 'storage_fee', editable: true, maxWidth: 140 },
                    { headerName: 'Pick And Pack', field: 'pick_and_pack_fee', editable: true, maxWidth: 140 },
                    { headerName: 'Custom', field: 'custom_fee', editable: true, maxWidth: 140 },]
            }
        ]
    )

    const updateWhData = (data) => {
        setRowData(prevRowData => [...prevRowData, data]);
    };


    useEffect(() => {
        getData('warehouse').then(data => {
            const flattenedData = [];

            for (const warehouse in data) {
                for (const product_tag in data[warehouse]) {
                    const item = data[warehouse][product_tag];
                    flattenedData.push({ warehouse, product_tag, ...item });
                }
            }
            setRowData(prevRowData => {
                const newData = [...prevRowData];
                flattenedData.forEach(item => {
                    const exists = newData.find(row => row.name_id === item.name_id && row.product_tag === item.product_tag);
                    if (!exists) {
                        newData.push(item);
                    }
                });
                return newData;
            });

        });
    }, []);

    window.ptr = rowData;

    const handleCellValueChanged = async (event) => {
        try {
            console.log('event.data', event.data)
            for (let key in event.data) {
                if (event.data[key] === undefined || event.data[key] === null) {
                    console.error(`Error: ${key} is empty`);
                    return;
                }
            }
            const response = await axios.patch(`http://localhost:8000/warehouse/${event.data.name_id}/${event.data.product_tag}`, event.data);
        } catch (error) {
            console.error('Error updating Warehouse data:', error);
            // Handle error appropriately (e.g., display a message)
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


    return (
        <div className="ag-theme-quartz-dark" style={{ height: '70vh', width: 1270 }}>
            <SearchBar title='Warehouse' titlecount={rowData.length} search={search} setSearch={setSearch} data={rowData} setData={setRowData} selectedRows={selectedRows} setRerender={setRerender} />
            <AgGridReact
                columnDefs={colData}
                defaultColDef={{ flex: 1, filter: true, sortable: true, floatingFilter: true}}              
                  rowData={rowData}
                onCellValueChanged={handleCellValueChanged}
                onSelectionChanged={onSelectionChanged}
                onRowClicked={onRowClicked}
                suppressRowClickSelection={true}
                animateRows={true}
                rowSelection={'multiple'}
            >
            </AgGridReact>
            <WarehouseForm addWh={updateWhData} />
        </div>
    )
}

export default GridWarehouse;