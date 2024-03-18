import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap';
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';
import '../App.css';



async function fetchCountries() {
    const res = await axios.get('http://localhost:8000/country');
    return res.data;
}

const countries = fetchCountries();

const ModalPopUp = ({ isOpen, handleClose, selectedItem, title }) => {
    
    return (
        <Modal show={isOpen} onHide={handleClose} className='my-modal'>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{selectedItem}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
const CustomSearch = ({ title }) => {

    const handleExport = () => {
        // const title_name = title + '.xlsx';

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
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    

    return (
        <div>
            <div className='boxing-day'>
                <CustomSearch title={warehouse.name_id} />
                <div className='boxing-tide'>
                    <div>
                        <div className='boxing-title'>Origin</div>
                        <div className='boxing-item'>{warehouse.origin}</div>
                    </div>
                    <div>
                        <div className='boxing-title'>Product Tags</div>
                        <div className='boxing-item'>
                            {Object.keys(warehouse.products).join(', ')}
                        </div>
                    </div>
                    <div>
                        <div className='boxing-title'>Shipping Countries</div>
                        <div className='boxing-item' onClick={handleOpen}>
                            {Object.values(warehouse.countries).join(', ')}
                        </div>
                        <ModalPopUp isOpen={isOpen} handleClose={handleClose} title={'Countries'} selectedItem={warehouse.countries}/>
                    </div>
                </div>
            </div>
        </div>
    )
}



export const ConfigTable = () => {
    const [wh, setWh] = useState();
    window.ww = wh;

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('http://localhost:8000/warehouseconfig');
            if (res.data) {
                const data = res.data;
                const obj = {}
                Object.entries(data).forEach(([wh_name, inside]) => {
                    obj[wh_name] = {
                        name_id: wh_name,
                        origin: inside.origin[0],
                        products: inside.products,
                        countries: inside.countries_to_ship
                    }
                    console.log('wh_name2:', wh_name);
                })
                setWh(prev => ({ ...prev, ...obj }))
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            {wh && Object.values(wh).map((warehouse, index) => (
                <ConfigTableIt key={index} warehouse={warehouse} />
            ))}
        </div>
    )
}
