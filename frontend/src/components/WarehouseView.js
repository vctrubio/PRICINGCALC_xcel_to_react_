import React, { useEffect, useMemo, useState } from 'react'
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
    const [search, setSearch] = useState('');
    const [rowData, setRowData] = useState([])
    const [colData, setColData] = useState(
        [
            { headerName: 'WH ID', field: 'name_id', minWidth: 300 },
            { headerName: 'Country Oirigin', field: 'origin', editable: true, width: 150 },
            { headerName: 'Product Tag', field: 'product_tag', editable: true, width: 200 },
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
            console.log(flattenedData)
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

    return (
        <div className="ag-theme-quartz-dark" style={{ height: '70vh', width: 1270 }}>
            <SearchBar title='Warehouse' titlecount={rowData.length} search={search} setSearch={setSearch} data={rowData}/>
            <AgGridReact
                columnDefs={colData}
                defaultColDef={{ flex: 1 }}
                rowData={rowData}>

            </AgGridReact>
            <WarehouseForm addWh={updateWhData} />
        </div>
    )
}

export default GridWarehouse;