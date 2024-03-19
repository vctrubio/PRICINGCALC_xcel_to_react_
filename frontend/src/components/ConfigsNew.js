import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap';
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';
import '../App.css';


const ModalPopUp = ({ title, isOpen, onClose, onConfirm, itemDict, selectedItem, allItems, maxSelected }) => {
    const [tempSelectedNames, setTempSelectedNames] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [columns, setColumns] = useState([]);

    const inputRef = useRef();

    useEffect(() => {
        setColumns([...new Set(Object.values(itemDict).sort())]);
        if (isOpen) {
            inputRef.current.focus();
        }
        if (typeof selectedItem === 'string') {
            setTempSelectedNames([selectedItem]);
        } else {
            setTempSelectedNames([...selectedItem]);
        }
    }, []);

    const handleClick = (name) => {
        setTempSelectedNames(prevNames => {
            if (prevNames.includes(name)) {
                return prevNames.filter(prevNames => prevNames !== name);
            } else {
                if (maxSelected === 1)
                    return [name];
                else if (maxSelected !== 0 && prevNames.length >= maxSelected)
                    return prevNames;
                else
                    return [...prevNames, name];
            }
        });
    }

    const handleConfirm = () => {
        handleClose();
        const data = tempSelectedNames;
        onConfirm(data);
    }

    const handleClose = () => {
        onClose();
        setSearchTerm('')
    }

    const unselectAll = () => {
        setTempSelectedNames([]);
    }

    const selectAll = () => {
        setTempSelectedNames(allItems);
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            const searchResults = allItems.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
            if (searchResults.every(name => tempSelectedNames.includes(name))) {
                setTempSelectedNames(prevNames => prevNames.filter(name => !searchResults.includes(name)));
            }
            else
                setTempSelectedNames(prevNames => [...new Set([...prevNames, ...searchResults])]);
        }
    }

    const filteredItems = allItems.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
    window.f = filteredItems
    return (
        <Modal show={isOpen} onHide={handleClose} className='my-modal'>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
                <input className='p-1'
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleEnter}
                    style={{ marginLeft: '15px' }}
                />
            </Modal.Header>
            <Modal.Body>
                <Modal.Body>
                    <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '1px' }}>
                        {filteredItems.sort()
                            .map((key) => (
                                <li key={key} onClick={() => handleClick(key)} style={{ cursor: 'pointer' }}>
                                    <div
                                        style={{
                                            backgroundColor: tempSelectedNames.includes(key) ? 'lightblue' : 'white',
                                            padding: '10px',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        {key}
                                    </div>
                                </li>
                            ))}
                    </ul>
                </Modal.Body>
            </Modal.Body>
            <Modal.Footer style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button variant="light" onClick={unselectAll}
                    className="bi bi-thermometer">
                </Button>
                <Button variant="light" onClick={selectAll}
                    className="bi bi-thermometer-high">
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

const CustomSearchBar = ({ title }) => {

    const handleExport = () => {
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

const ConfigTableIt = ({ warehouse, countries }) => {

    const [isCountriesOpen, setIsCountriesOpen] = useState(false);
    const [isOriginOpen, setIsOriginOpen] = useState(false);

    const [shippingCountries, setShippingCountries] = useState(warehouse.countries);
    const [origin, setOrigin] = useState(warehouse.origin);

    const handleCountriesOpen = () => setIsCountriesOpen(true);
    const handleCountriesClose = () => setIsCountriesOpen(false);

    const handleOriginOpen = () => setIsOriginOpen(true);
    const handleOriginClose = () => setIsOriginOpen(false);

    const patch = async (name_id, data, type) => {
        try {
            const res = await axios.patch(`http://localhost:8000/warehouseconfig/${name_id}`, { key: type, value: data });
            if (type === "countries_to_ship") {
                setShippingCountries(data);
            }
            else if (type === "origin") {
                setOrigin(data);
            }
        } catch (error) {
            console.error('Error:', error.response.data);
        }
    }

    return (
        <div>
            <div className='boxing-day'>
                <CustomSearchBar title={warehouse.name_id} />
                <div className='boxing-tide'>
                    <div>
                        <div className='boxing-title'>Origin</div>
                        <div className='boxing-item' onClick={handleOriginOpen}>{origin}</div>
                        <ModalPopUp isOpen={isOriginOpen} onClose={handleOriginClose} title={'Origin'} selectedItem={warehouse.origin} allItems={Object.keys(countries)} itemDict={countries} maxSelected={1}
                            onConfirm={(data) => patch(warehouse.name_id, data, "origin")} />
                    </div>
                    <div>
                        <div className='boxing-title'>Product Tags</div>
                        <div className='boxing-item-grey'>
                            {Object.keys(warehouse.products).join(', ')}
                        </div>
                    </div>
                    <div>
                        <div className='boxing-title'>Shipping Couriers</div>
                        <div className='boxing-item-grey'>
                            {warehouse.shipping_couriers ? Object.keys(warehouse.shipping_couriers).join(', ') : ''}
                        </div>
                    </div>
                    <div>
                        <div className='boxing-title'>Shipping Countries</div>
                        <div className='boxing-item' onClick={handleCountriesOpen}>
                            {shippingCountries.join(', ')}
                        </div>
                        <ModalPopUp isOpen={isCountriesOpen} onClose={handleCountriesClose} title={'Countries'} selectedItem={warehouse.countries} allItems={Object.keys(countries)} itemDict={countries}
                            onConfirm={(data) => patch(warehouse.name_id, data, "countries_to_ship")} />
                    </div>
                </div>
            </div>
        </div>
    )
}



export const ConfigTable = () => {
    const [wh, setWh] = useState();
    const [countries, setCountries] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('http://localhost:8000/country');
            if (res.data) {
                setCountries(res.data);
            }
        }
        fetchData();
    }
        , []);

    window.ww = wh;
    window.cc = countries;

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
                        countries: inside.countries_to_ship,
                        shipping_couriers: inside.Shipping
                    }
                })
                setWh(prev => ({ ...prev, ...obj }))
            }
        }
        fetchData();
    }, []);

    return (
        <div style={{ color: 'white' }}>
            <div>
                {wh && Object.values(wh).map((warehouse, index) => (
                    <ConfigTableIt key={index} warehouse={warehouse} countries={countries} />
                ))}
            </div>
            <h2 style={{ marginTop: 15, textAlign: 'left' }}>Countries</h2>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Country Code</th>
                            <th>Country Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {countries && Object.entries(countries).map(([key, value], index) => (
                            <tr key={index}>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
