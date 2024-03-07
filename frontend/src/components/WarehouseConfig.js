import React, { useCallback, useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';
import { useSkuForm } from './CskuForm';
import { SearchBar } from './SearchBar';

export const GridWarehouseConfig = () => {
    const [rowData, setRowData] = useState({})
    // const colData = {
    //     'Warehouse',
    //     'Origin',
    //     'Countries',
    //     'Shipping'
    // }

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('http://localhost:8000/warehouseconfig');
            setRowData(response.data);
        }
        fetchData();
    }, []);


    window.tra = rowData

    return (
        <div style={{ color: 'white',  border: '1px solid black'}}>
            <table>
                <thead>
                    <tr>
                        <th>WarehouseName</th>
                        <th>Origin</th>
                        <th>Countries</th>
                        <th>Shipping</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(rowData).map(([key, value], index) => (
                        <tr key={index}>
                            <td>{key}</td>
                            <td>{value.origin}</td>
                            <td>{value.countries_to_ship.join(', ')}</td>
                            <td>{value.Shipping ? Object.keys(value.Shipping).join(', ') : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
