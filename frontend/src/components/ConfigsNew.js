import React, { useCallback, useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import axios from 'axios'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';
import { getData, useSkuForm } from './CskuForm';
import { SearchBar } from './SearchBar';

const CustomSearch = ({ title }) => {

    const handleExport = () => {
        const title_name = title + '.xlsx';


        return 12;
    };


    const handleImport = async () => {

    };


    return (
        <div className='d-flex justify-content-between'>
            <h1 style={{ fontFamily: 'Roboto', paddingTop: 16, textAlign: 'left' }} >
                {title}
            </h1>
            <div style={{ paddingTop: 22 }}>
                <button className="btn btn-dark"
                    style={{ marginLeft: '10px', fontSize: '20px', textAlign: 'center' }}
                    title={`Upload: '${title}'`}
                    onClick={handleImport}
                >
                    <i className="bi bi-upload"></i>
                </button>
                <button className="btn btn-dark"
                    style={{ marginLeft: '10px', fontSize: '20px', paddingTop: 6 }}
                    title={`Download:'${title}'`}
                    onClick={handleExport}
                >
                    <i className="bi bi-cloud-download"></i>
                </button>
            </div>
        </div>
    )
}

const ConfigTableIt = ({ warehouse }) => {

    return (
        <div>
            <div className='boxing-day'>
                <CustomSearch title={warehouse} />
                <div className='boxing-tide'>
                    <div>
                        <div className='boxing-title'>Origin</div>
                        <div className='boxing-item'>one</div>
                    </div>
                    <div>
                        <div className='boxing-title'>Product Tags</div>
                        <div className='boxing-item'>one two three four five six</div>
                    </div>
                    <div>
                        <div className='boxing-title'>Shipping Countries</div>
                        <div className='boxing-item'>one two three</div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export const ConfigTable = () => {
    // const [warehouses] = getData()
    const { getData } = useSkuForm();
    const [wh, setWh] = useState();
    window.ww = wh;

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('http://localhost:8000/warehouseconfig');
            console.log('wh res:', res.data);
            if (res.data) {
                const data = res.data;
                Object.entries(data).map(([wh_name, inside]) => {
                    console.log('name. ', wh_name)
                    console.log('origin: ', inside.origin[0])
                    console.log('products: ', inside.products)
                    console.log('countries: ', inside.countries_to_ship)
                })
                const whNames = Object.keys(data);
                setWh(whNames);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            {/* {wh.map((warehouse, index) => (
                <ConfigTableIt key={index} warehouse={warehouse} />
            ))} */}
        </div>
    )
}
