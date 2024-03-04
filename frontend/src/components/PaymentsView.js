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

const ConsumerPPFee = () => {
    const [search, setSearch] = useState('');

    const rowData2 = [
        { 'Country': 'Spain', 'Sales Fee %': 2, 'Sales Fee $': 0.5 },
        { 'Country': 'France', 'Sales Fee %': 3, 'Sales Fee $': 0.75 },
        { 'Country': 'Germany', 'Sales Fee %': 2.5, 'Sales Fee $': 0.6 },
        { 'Country': 'China', 'Sales Fee %': 2.8, 'Sales Fee $': 0.7 },
        { 'Country': 'USA', 'Sales Fee %': 3, 'Sales Fee $': 0.8 },
        { 'Country': 'Portugal', 'Sales Fee %': 2.2, 'Sales Fee $': 0.55 },
        { 'Country': 'Belgium', 'Sales Fee %': 2.7, 'Sales Fee $': 0.65 },
        { 'Country': 'Holland', 'Sales Fee %': 2.3, 'Sales Fee $': 0.58 },
        { 'Country': 'Taiwan', 'Sales Fee %': 3.5, 'Sales Fee $': 0.88 },
        { 'Country': 'Italy', 'Sales Fee %': 2.6, 'Sales Fee $': 0.63 },
        { 'Country': 'Switzerland', 'Sales Fee %': 2.1, 'Sales Fee $': 0.52 },
        { 'Country': 'Austria', 'Sales Fee %': 2.4, 'Sales Fee $': 0.58 },
        { 'Country': 'Philippines', 'Sales Fee %': 3.2, 'Sales Fee $': 0.8 },
    ];

    const colData2 = [
        { headerName: 'Country', field: 'Country', width: 200 },
        { headerName: 'Sales Fee %', field: 'Sales Fee %', width: 100 },
        { headerName: 'Sales Fee $', field: 'Sales Fee $', width: 100 },
    ];


    const rowData3 = [
        { 'Country': 'Spain', 'Visa': 10, 'Mastercard': 20, 'PayPal': 40, 'American Express': 5, 'Stripe': 0, 'Square': 0, 'Apple Pay': 10, 'Google Pay': 0, 'Amazon Pay': 0, 'Klarna': 0 },
        { 'Country': 'France', 'Visa': 15, 'Mastercard': 25, 'PayPal': 35, 'American Express': 0, 'Stripe': 0, 'Square': 0, 'Apple Pay': 5, 'Google Pay': 0, 'Amazon Pay': 0, 'Klarna': 0 },
        { 'Country': 'Germany', 'Visa': 20, 'Mastercard': 30, 'PayPal': 25, 'American Express': 5, 'Stripe': 0, 'Square': 0, 'Apple Pay': 5, 'Google Pay': 0, 'Amazon Pay': 0, 'Klarna': 0 },
        { 'Country': 'China', 'Visa': 5, 'Mastercard': 5, 'PayPal': 5, 'American Express': 0, 'Stripe': 0, 'Square': 0, 'Apple Pay': 0, 'Google Pay': 80, 'Amazon Pay': 5, 'Klarna': 0 },
        { 'Country': 'USA', 'Visa': 15, 'Mastercard': 15, 'PayPal': 10, 'American Express': 10, 'Stripe': 40, 'Square': 5, 'Apple Pay': 0, 'Google Pay': 0, 'Amazon Pay': 5, 'Klarna': 0 },
        { 'Country': 'Portugal', 'Visa': 10, 'Mastercard': 20, 'PayPal': 25, 'American Express': 5, 'Stripe': 0, 'Square': 0, 'Apple Pay': 5, 'Google Pay': 0, 'Amazon Pay': 0, 'Klarna': 20 },
        { 'Country': 'Belgium', 'Visa': 15, 'Mastercard': 25, 'PayPal': 20, 'American Express': 0, 'Stripe': 0, 'Square': 0, 'Apple Pay': 5, 'Google Pay': 0, 'Amazon Pay': 0, 'Klarna': 0 },
        { 'Country': 'Holland', 'Visa': 10, 'Mastercard': 20, 'PayPal': 30, 'American Express': 0, 'Stripe': 0, 'Square': 0, 'Apple Pay': 5, 'Google Pay': 0, 'Amazon Pay': 0, 'Klarna': 10 },
        { 'Country': 'Taiwan', 'Visa': 10, 'Mastercard': 10, 'PayPal': 5, 'American Express': 0, 'Stripe': 0, 'Square': 0, 'Apple Pay': 10, 'Google Pay': 5, 'Amazon Pay': 40, 'Klarna': 10 },
        { 'Country': 'Italy', 'Visa': 15, 'Mastercard': 20, 'PayPal': 25, 'American Express': 0, 'Stripe': 0, 'Square': 0, 'Apple Pay': 5, 'Google Pay': 0, 'Amazon Pay': 0, 'Klarna': 15 },
        { 'Country': 'Switzerland', 'Visa': 10, 'Mastercard': 20, 'PayPal': 15, 'American Express': 5, 'Stripe': 0, 'Square': 0, 'Apple Pay': 10, 'Google Pay': 0, 'Amazon Pay': 0, 'Klarna': 10 },
        { 'Country': 'Austria', 'Visa': 10, 'Mastercard': 20, 'PayPal': 20, 'American Express': 0, 'Stripe': 0, 'Square': 0, 'Apple Pay': 5, 'Google Pay': 0, 'Amazon Pay': 0, 'Klarna': 20 },
        { 'Country': 'Philippines', 'Visa': 5, 'Mastercard': 10, 'PayPal': 5, 'American Express': 0, 'Stripe': 0, 'Square': 0, 'Apple Pay': 5, 'Google Pay': 0, 'Amazon Pay': 30, 'Klarna': 25 },
    ];

    const colDefs3 = [
        { headerName: 'Country', field: 'Country', width: 150 },
        { headerName: 'Visa', field: 'Visa', width: 80 },
        { headerName: 'Mastercard', field: 'Mastercard', width: 100 },
        { headerName: 'PayPal', field: 'PayPal', width: 80 },
        { headerName: 'American Express', field: 'American Express', width: 120 },
        { headerName: 'Stripe', field: 'Stripe', width: 80 },
        { headerName: 'Square', field: 'Square', width: 80 },
        { headerName: 'Apple Pay', field: 'Apple Pay', width: 80 },
        { headerName: 'Google Pay', field: 'Google Pay', width: 100 },
        { headerName: 'Amazon Pay', field: 'Amazon Pay', width: 100 },
        { headerName: 'Klarna', field: 'Klarna', width: 80 },
    ];
    
    
    return (
        <div className="ag-theme-quartz-dark" style={{ height: 210, width: 1270 }}>
            <AgGridReact 
                columnDefs={colDefs3}
                defaultColDef={{ flex: 1 }}
                rowData={rowData3}
                />
            <AgGridReact className='mt-3'
                columnDefs={colData2}
                defaultColDef={{ flex: 1 }}
                rowData={rowData2}
                />
        </div>
    )
}

const PaymentProcessingCard = () => 
{
    const [rowData, setRowData] = useState([]);
    const colData  = [
        { headerName: 'Card', field: 'name_id', minWidth: 150},
        { headerName: 'Rate %', field: 'rate_', minWidth: 150, editable: true },
        { headerName: 'Fee', field: 'fee', minWidth: 150, editable: true },
    ]
    
    useEffect(() => {
        getData('paymentprocessingcard', 'value').then(data => {
            console.log('data: ', data)
            setRowData(data);
        });
    },[]);

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
        <div style={{height: 420, width: 1270, marginBottom: 100}}>
            <SearchBar title='PaymentProcessingCard' titlecount={rowData.length} search={null} setSearch={null} data={rowData}></SearchBar>
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


const PaymentProcessingCountry = () =>
{
    const [rowData, setRowData] = useState([]);
    const colData  = [
        { headerName: 'Country', field: 'name_id', minWidth: 150},
        { headerName: 'Sales Fee %', field: 'sales_fee', minWidth: 150, editable: true },
        { headerName: 'Sales Fee €', field: 'sales_fee', minWidth: 150, editable: true },
    ]
    
    useEffect(() => {
        getData('paymentprocessingcountry', 'value').then(data => {
            console.log('data: ', data)
            setRowData(data);
        });
    },[]);

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
        <div style={{height: 420, width: 1270, marginBottom: 100}}>
            <SearchBar title='PaymentProcessingCountry' titlecount={rowData.length} search={null} setSearch={null}  data={rowData}></SearchBar>
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
            <PaymentProcessingCountry/>
            <PaymentProcessingCard/>
        </div>
    )
};
