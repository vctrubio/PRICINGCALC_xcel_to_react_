import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';

import axios from 'axios'
import { getData, useSkuForm } from './CskuForm';
import { SkuForm } from './SkuForm';
import { Form, Button } from 'react-bootstrap';
import { SearchBar } from './SearchBar';

const PaymentProcessingCard = () => {
    const [gridApi, setGridApi] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [rerender, setRerender] = useState(false);
    const [rowData, setRowData] = useState([]);
    const colData = [
        { headerName: 'Card', field: 'name_id', minWidth: 150 },
        { headerName: 'Rate %', field: 'rate_', minWidth: 150, editable: true },
        { headerName: 'Fee', field: 'fee', minWidth: 150, editable: true },
    ]

    useEffect(() => {
        getData('paymentprocessingcard', 'value').then(data => {
            setRowData(data);
        });
    }, []);

    window.ppc = rowData

    const handleChangeCell = async (event) => {
        try {
            for (let key in event.data) {
                if (event.data[key] === undefined || event.data[key] === null) {
                    console.error(`Error: ${key} is empty`);
                    return;  // Exit the function if an empty field is found
                }
            }
            const response = await axios.patch(`http://localhost:8000/paymentprocessingcard/${event.data.name_id}`, event.data);
        } catch (error) {
            console.error('Error updating Payment Processing Card data:', error);
        }
    }

    return (
        <div style={{ height: 420, width: 1270, marginBottom: 100 }}>
            <SearchBar title='PaymentProcessingCard' titlecount={rowData.length} search={null} setSearch={null} data={rowData} setData={setRowData} selectedRows={selectedRows} setRerender={setRerender}></SearchBar>
            <AgGridReact
                columnDefs={colData}
                defaultColDef={{ flex: 1 }}
                rowData={rowData}
                onCellValueChanged={handleChangeCell}
            >
            </AgGridReact>
        </div>
    )
}


const PaymentProcessingCountry = () => {
    const [gridApi, setGridApi] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [rerender, setRerender] = useState(false);
    const [rowData, setRowData] = useState([]);
    const colData = [
        { headerName: 'Country', field: 'name_id', minWidth: 150 },
        { headerName: 'Sales Fee %', field: 'sales_fee', minWidth: 150, editable: true },
        { headerName: 'Sales Fee €', field: 'sales_fee', minWidth: 150, editable: true },
    ]

    useEffect(() => {
        getData('paymentprocessingcountry', 'value').then(data => {
            setRowData(data);
        });
    }, []);

    window.ppc = rowData

    const handleChangeCell = async (event) => {
        try {
            for (let key in event.data) {
                if (event.data[key] === undefined || event.data[key] === null) {
                    console.error(`Error: ${key} is empty`);
                    return;  // Exit the function if an empty field is found
                }
            }
            const response = await axios.patch(`http://localhost:8000/paymentprocessingcountry/${event.data.name_id}`, event.data);
        } catch (error) {
            console.error('Error updating Payment Processing Country data:', error);
        }
    }

    return (
        <div style={{ height: 420, width: 1270, marginBottom: 100 }}>
            <SearchBar title='PaymentProcessingCountry' titlecount={rowData.length} search={null} setSearch={null} data={rowData} setData={setRowData} selectedRows={selectedRows} setRerender={setRerender}></SearchBar>
            <AgGridReact
                columnDefs={colData}
                defaultColDef={{ flex: 1 }}
                rowData={rowData}
                onCellValueChanged={handleChangeCell}
            >
            </AgGridReact>
        </div>
    )
}

const PaymentDf = () => {
    const [gridApi, setGridApi] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [colData, setColData] = useState([]);
    const [rerender, setRerender] = useState(false);
    const dfSetRows = (data) => {
        let ptrRow = [];
        let ptrCol = ['Country'];

        for (var country in data) {
            if (data.hasOwnProperty(country)) {
                var row = data[country];
                row.Country = country;
                ptrRow.push({ ...row, Country: country });

                let columnNames = Object.keys(row);
                columnNames.forEach((col) => {
                    if (!ptrCol.includes(col)) {
                        ptrCol.push(col);
                    }
                });
            }
        }

        setRowData(ptrRow);
        setColData(
            ptrCol.map((col) => ({
                headerName: col,
                field: col,
                editable: col != 'Country',
                minWidth: 50,
            }))
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/paymentpopcountry');
                dfSetRows(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleChangeCell = async (event) => {
        const { data, colDef, newValue } = event;
        const countryId = data['Country']; // Assuming 'Country' is the key for country names

        // Make API call to update the specific cell value
        const apiUrl = `http://localhost:8000/paymentpopcountry/${countryId}`;
        const payload = { [colDef.field]: newValue };

        axios.patch(apiUrl, payload)
            .catch(error => console.error(error));
    };


    return (
        <div style={{ height: 420, width: 1270, marginBottom: 100 }}>
            <SearchBar title='PaymentPopCountry' titlecount={rowData.length} search={null} setSearch={null} data={rowData} setData={setRowData} selectedRows={selectedRows} setRerender={setRerender}></SearchBar>
            <AgGridReact
                columnDefs={colData}
                defaultColDef={{ flex: 1 }}
                rowData={rowData}
                onCellValueChanged={handleChangeCell}
            >
            </AgGridReact>
        </div>
    )


}


export const Payments = () => {

    return (
        <div className='ag-theme-quartz-dark'>
            <PaymentProcessingCountry />
            <PaymentProcessingCard />
            <PaymentDf />
        </div>
    )
};
