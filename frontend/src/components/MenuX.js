import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import axios from 'axios';
import { useSkuForm } from './CskuForm';
import '../App.css';

function transformWarehouse2(warehouse) {
    const result = {
        warehouseID: warehouse[0],
        originID: warehouse[1].origin[0],
        productTags: warehouse[1].products,
        countries: warehouse[1].countries_to_ship,
        shipping: warehouse[1].Shipping,
    };
    return result;
}

function transformWarehouse(warehouse) {
    return Object.entries(warehouse).map(([keys, details]) => {
        return {
            warehouseID: details.name_id,
            originID: details.origin,
            productTags: keys
        };
    });
}

const theme = createTheme({
    overrides: {
        MuiAutocomplete: {
            paper: {
                backgroundColor: '#8caad4',
            },
        },
        MuiListItem: {
            root: {
                '&:hover': {
                    opacity: 0.1, //not working bitch
                },
            },
        },
    },
});

function WarehousesSort({ warehouses }) {
    const transformedWarehouses = warehouses
        ? Object.entries(warehouses)
            .flatMap(transformWarehouse2)
            .filter(warehouse => Object.keys(warehouse).length !== 0)
        : [];

    const uniqueIds = Array.from(new Set(transformedWarehouses.map(item => JSON.stringify({ warehouseID: item.warehouseID, originID: item.originID }))), JSON.parse);
    return uniqueIds.sort((a, b) => a.originID.localeCompare(b.originID));
}

function getDataByTag(warehouse, tags) {
    console.log('getdataby tag:', warehouse, tags)
    const resultArray = [];

    for (const key in warehouse) {
        if (tags.includes(key)) {
            if (!resultArray.includes(warehouse[key])) {
                resultArray.push({ ...warehouse[key], product_tag: key });
            }
        }

    }
    return resultArray;
}




export const FormX = () => {

    const { getData } = useSkuForm();

    const [selectedWh, setSelectedWh] = useState("");
    const [selectedSku, setSelectedSku] = useState([]);
    const [selectedPT, setSelectedPT] = useState([]);
    const [allSku, setAllSku] = useState([]);
    const [countries, setCountries] = useState([])
    const [whConfig, setWhConfig] = useState({})
    const [shipping, setShipping] = useState([])

    window.c = countries
    window.skus = allSku
    window.wc = whConfig
    window.sels = selectedSku
    window.selw = selectedWh
    window.selhey = selectedPT
    window.selship = shipping

    const configWh = async (data) => {
        for (const [key] of Object.entries(data)) {
            const reply = await axios.get(`http://localhost:8000/warehouseconfig/${key}`);
            setWhConfig(prevWhConfig => ({ ...prevWhConfig, [key]: reply.data }));
        }
    }

    useEffect(() => {
        const fetch = async () => {
            try {
                const [wh, sku] = await Promise.all([
                    getData('warehouse', 'value'),
                    getData('psku', 'value'),
                ]);
                const tempWh = wh.reduce((acc, warehouse) => {
                    const warehouseId = Object.values(warehouse)[0].name_id;
                    acc[warehouseId] = warehouse;
                    return acc;
                }, {});
                configWh(tempWh)
                setAllSku(sku)
            }
            catch (error) {
                console.error('Error Pricing Calculator Caling API:', error);
            }
        }
        const fetchSingular = async (name) => {
            try {
                const response = await axios.get(`http://localhost:8000/${name}`)
                if (response.data)
                    setCountries(response.data)
            }
            catch (error) {
            }
        }
        const fetchShipping = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/shipping`)
                if (response.data) {
                    response.data.forEach(res => {
                        const myDict = {
                            warehouse: res.warehouse,
                            courier: res.name_id,
                            types: Object.keys(res.shipping_table)
                        }
                        setShipping(prevShipping => [...prevShipping, myDict]);
                        //needs to set the data, but also keep in mind which ids we have... also affects the types
                    })
                }
            }
            catch (error) {
            }
        }

        fetch()
        fetchSingular('country')
        fetchShipping()
    }, []);

    useEffect(() => {
        if (selectedSku && selectedSku.length > 0) {
            const newProductTag = selectedSku[selectedSku.length - 1].product_tag;
            if (!selectedPT.includes(newProductTag)) {
                setSelectedPT([...selectedPT, newProductTag]);
            }
        }
        else if (selectedSku && selectedSku.length === 0) {
            setSelectedPT([]);
        }
    }, [selectedSku]);

    useEffect(() => {
        if (!selectedWh && !selectedSku) {
            setSelectedPT([])
        }
        else if (selectedWh && whConfig[selectedWh.warehouseID]) {
            const warehouseKeys = Object.keys((whConfig[selectedWh.warehouseID]).products);
            setSelectedPT(warehouseKeys);
        }
    }, [selectedWh]);

    const handleReset = (name) => {
        if (name === 'wh') {
            if (selectedWh) {
                localStorage.setItem('selectedWh', JSON.stringify(selectedWh));
                setSelectedWh("")
            }
            else
                setSelectedWh(JSON.parse(localStorage.getItem('selectedWh')));
        }
        if (name === 'sku') {
            if (selectedSku.length > 0) {
                localStorage.setItem('selectedSku', JSON.stringify(selectedSku));
                setSelectedSku([])
            }
            else
                setSelectedSku(JSON.parse(localStorage.getItem('selectedSku')));
        }
    }

    function WarehouseSearch({ warehouses, onWarehouseSelect }) {
        const tw = warehouses ? Object.entries(warehouses) : [];
        const uniqueIds = Array.from(new Set(tw.map(item => JSON.stringify({ warehouseID: item[0], originID: item[1].origin[0] }))), JSON.parse);
        uniqueIds.sort((a, b) => a.originID.localeCompare(b.originID));

        return (
            <ThemeProvider theme={theme}>
                <Autocomplete
                    id="combo-box-wh"
                    options={uniqueIds}
                    getOptionLabel={(option) => {
                        return `${option.warehouseID}, ${option.originID}`;
                    }}
                    style={{ width: 300 }}
                    onChange={onWarehouseSelect}
                    renderInput={(params) => (
                        <TextField {...params} label="Search" />
                    )}
                />
            </ThemeProvider>
        );
    }

    const SearchBar = ({ options, onChange }) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ThemeProvider theme={theme}>
                    <Autocomplete
                        id="combo-box-sku"
                        options={options}
                        getOptionLabel={(option) => `${option.name_id} ${option.description} (${option.product_tag})`}
                        style={{ width: 270 }}
                        onChange={onChange}
                        renderInput={(params) => (
                            <TextField {...params} label="Search" />
                        )}
                    />
                </ThemeProvider>
            </div>
        );
    };

    const handleWhToggleTag = (key) => {
        setSelectedPT(prevSelectedPT => {
            if (prevSelectedPT.includes(key)) {
                return prevSelectedPT.filter(k => k !== key);
            } else {
                return [...prevSelectedPT, key];
            }
        });
    }

    const themometerOn = () => {
        setSelectedPT(Object.keys(whConfig[selectedWh.warehouseID].products))
    }

    const themometerOff = () => {
        setSelectedPT([])
    }

    const SearchContent = () => {
        const [search, setSearch] = useState('');

        if (!selectedWh || !(whConfig[selectedWh.warehouseID]).products)
            return;

        const handleChange = (event) => {
            setSearch(event.target.value);
        };

        const filteredPT = Object.keys((whConfig[selectedWh.warehouseID]).products).filter(item => item.toLowerCase().includes(search.toLowerCase()));

        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                setSelectedPT(Object.keys((whConfig[selectedWh.warehouseID].products)).filter(item => item.toLowerCase().includes(search.toLowerCase())));
            }
        };

        return (
            <div className='search-content'>
                <form>
                    <input type="search" placeholder='product-tag' onChange={handleChange} onKeyDown={handleKeyDown} style={{ width: '100%' }}>
                    </input>
                    {
                        search.length > 0 && (
                            <div style={{ position: 'relative' }}>
                                <div className='align-dropdown-up'>
                                    {filteredPT.map((item, index) => (
                                        <div type='button' key={index} onClick={() => {
                                            setSearch(item);
                                            setSelectedPT(Object.keys((whConfig[selectedWh.warehouseID]).products).filter(item => item.toLowerCase().includes(search.toLowerCase())));
                                        }}>{item}</div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </form>
            </div>
        )
    }

    const [showDropdown, setShowDropdown] = useState({
        country: false,
        shippingName: false,
        shippingType: false,
    });

    // Toggle a specific dropdown
    const toggleDropdown = (dropdown) => {
        setShowDropdown(prevState => ({
            ...prevState,
            [dropdown]: !prevState[dropdown]
        }));
    };

    const [uiShipping, setUiShipping] = useState({
        country: '',
        shipping: '',
        type: '',
        b2c: true,
    });
    window.uis = uiShipping

    const [uiOM, setUiOM] = useState("")
    const [uiTax, setUiTax] = useState("")
    const [uiMk, setUiMk] = useState("")
    const [uiDC, setUiDC] = useState("")

    const [CalcOutput, setCalcOutput] = useState({
        priceWithDiscount: 0, //price with discount
        priceWithoutDiscount: 0, //price without discount
        toWarehouseMargin: 0, //margin to warehouse
        toConsumerMargin: 0, //margin to consumer
    })

    useEffect(() => {

        function conditionApi() {
            if (selectedSku.length > 0 && selectedWh && uiShipping.country && uiShipping.shipping && uiShipping.type
                && uiOM && uiTax && uiMk)
                return true;
        }

        setCalcOutput(prevState => ({
            ...prevState,
            priceWithDiscount: 0,
            priceWithoutDiscount: 0,
        }));
        setCalcOutput(prevState => ({
            ...prevState,
            toConsumerMargin: 0,
            toWarehouseMargin: 0,
        }));
        if (conditionApi()) {
            const item = {
                warehouse_name: selectedWh.warehouseID,
                pskus: selectedSku.map(sku => sku.name_id),
                total_cogs: selectedSku.reduce((total, sku) => total + sku._total_cogs, 0),
                shipping_selection: { "courier": uiShipping.shipping, "type": uiShipping.type },
                zone: "zone_1"
            }
            const option = {
                objective_margin: parseFloat(uiOM),
                tax: parseFloat(uiTax),
                marketing: parseFloat(uiMk),
                country_input: uiShipping.country,

            }

            axios.post('http://localhost:8000/calculate', { item, option })
                .then(response => {
                    console.log(': ', item.total_cogs, ' total price: ', response.data);
                    setCalcOutput(prevState => ({
                        ...prevState,
                        priceWithoutDiscount: response.data,
                        priceWithDiscount: uiDC ? (response.data * (1 - parseFloat(uiDC) / 100)) : 0,
                        toConsumerMargin: parseFloat(uiOM),
                        toWarehouseMargin: (response.data - item.total_cogs) / response.data * 100
                    }));
                })
                .catch(error => {
                    console.error(error);
                });
        }

    }, [selectedSku, selectedWh, selectedPT, uiOM, uiDC, uiShipping, uiMk, uiTax]);


    const selectWhifEmpty = (warehouse) => {
        if (!selectedWh) {
            setSelectedWh({ warehouseID: warehouse.name_id, originID: warehouse.origin[0] });
        }
    }

    return (
        <div style={{ marginLeft: 50 }}>
            <div className='ck-head'>

                <div className='ck-head-in'>
                    <div className='d-flex flex-column' style={{ textAlign: 'left', position: 'relative' }}>
                        <div type='button'
                            style={{ color: uiShipping.country ? '#696862' : '', paddingLeft: 5 }}
                            onClick={() => { toggleDropdown('country'); setUiShipping({ ...uiShipping, country: null }); }}>
                            Country
                        </div>
                        {showDropdown.country && (
                            <div className='align-dropwdown-down'>
                                {Object.keys(countries).map((country, index) => (
                                    <div type='button' className='align-dropdown-bec' key={index}
                                        onClick={() => {
                                            setUiShipping(prevState => ({
                                                ...prevState,
                                                country: country
                                            }));
                                            toggleDropdown('country');
                                        }}
                                    >{country}</div>
                                ))}
                            </div>
                        )}
                        <div style={{ paddingLeft: 5 }}>
                            {uiShipping.country}
                        </div>
                    </div>

                    <div className='airplane-titor'>
                        <div className='d-flex flex-column' style={{ textAlign: 'left', position: 'relative', paddingLeft: 5 }}>
                            <div type='button'
                                style={{ color: uiShipping.shipping ? '#696862' : '' }}
                                onClick={() => { toggleDropdown('shippingName'); setUiShipping({ ...uiShipping, shipping: null, type: null }) }}>
                                Courier
                            </div>
                            {showDropdown.shippingName && (
                                <div className='align-dropwdown-down'>
                                    {shipping.map((shipping, index) => (
                                        <div type='button' className='align-dropdown-bec' key={index}
                                            onClick={() => {
                                                setUiShipping(prevState => ({
                                                    ...prevState,
                                                    shipping: shipping.courier
                                                }));
                                                toggleDropdown('shippingName');
                                            }}
                                        >{shipping.courier}</div>
                                    ))}
                                </div>
                            )}
                            <div className='pt-2' style={{ paddingLeft: 2 }}>
                                {uiShipping.shipping}
                            </div>
                        </div>

                        <div className='d-flex flex-column' style={{ textAlign: 'left', position: 'relative' }}>
                            <div type='button'
                                style={{ color: uiShipping.type ? '#696862' : '', paddingRight: 5 }}
                                onClick={() => {
                                    if (uiShipping && uiShipping.shipping) {
                                        toggleDropdown('shippingType');
                                        setUiShipping({ ...uiShipping, type: null });
                                    } else {
                                        alert('Please select a Courier first.');
                                    }
                                }}>
                                Type
                            </div>
                            {showDropdown.shippingType && uiShipping && uiShipping.shipping && (
                                <div className='align-dropwdown-down width-100'>
                                    {
                                        shipping.find(shipping => shipping.courier === uiShipping.shipping).types.map((type, index) => (
                                            <div type='button' className='align-dropdown-bec' key={index}
                                                onClick={() => {
                                                    setUiShipping(prevState => ({
                                                        ...prevState,
                                                        type: type
                                                    }));
                                                    toggleDropdown('shippingType');
                                                }}
                                            >{type}</div>
                                        ))
                                    }
                                </div>
                            )}
                            <div className='pt-2' s>
                                {uiShipping.type}
                            </div>
                        </div>
                    </div>

                </div>

                <div className='ck-head-in'>
                    <div className='airplane-titor'>
                        <div className='d-flex flex-column justify-content-between' style={{ textAlign: 'left', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 5 }}>
                                <div>
                                    Objective Margin
                                </div>
                            </div>
                            <input className='input-secondary'
                                type="number"
                                placeholder='%'
                                value={uiOM}
                                onChange={(e) => setUiOM(e.target.value)}
                                style={{ backgroundColor: (uiOM === null || uiOM === '' || uiOM === '0') ? 'transparent' : '', width: '100%' }}
                            />
                        </div>
                        <div className='d-flex flex-column justify-content-between' style={{ textAlign: 'left', width: '100%', marginLeft: 5 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 5 }}>
                                <div>
                                    Discount
                                </div>
                            </div>
                            <input className='input-secondary'
                                type="number"
                                placeholder='%'
                                value={uiDC}
                                onChange={(e) => setUiDC(e.target.value)}
                                style={{ backgroundColor: (uiDC === null || uiDC === '' || uiDC === '0') ? 'transparent' : '', width: '100%' }}
                            />
                        </div>

                    </div>
                    <div>
                        <div className='d-flex flex-column justify-content-between' style={{ textAlign: 'left', width: '80%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 5 }}>
                                <div>
                                    Tax
                                </div>
                            </div>
                            <input className='input-secondary'
                                type="number"
                                placeholder='%'
                                value={uiTax}
                                onChange={(e) => setUiTax(e.target.value)}
                                style={{ backgroundColor: (uiTax === null || uiTax === '' || uiTax === '0') ? 'transparent' : '', width: '100%' }}
                            />
                        </div>
                        <div className='d-flex flex-column justify-content-between' style={{ textAlign: 'left', width: '80%', marginLeft: 4 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 5 }}>
                                <div>
                                    Marketing
                                </div>
                            </div>
                            <input className='input-secondary'
                                type="number"
                                placeholder='%'
                                value={uiMk}
                                onChange={(e) => setUiMk(e.target.value)}
                                style={{ backgroundColor: (uiMk === null || uiMk === '' || uiMk === '0') ? 'transparent' : '', width: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>


            <div className='d-flex flex-row'>
                <div id='warehouse'>

                    <div className='ck-container'>
                        <div className='ck-helloword'>Warehouse</div>
                        <div className='ck-search-bar'>
                            <WarehouseSearch warehouses={whConfig} onWarehouseSelect={(event, newValue) => setSelectedWh(newValue)} />
                            <div className="btn" onClick={() => handleReset('wh')}>
                                <i className="bi bi-repeat"></i>
                            </div>
                        </div>
                        <div className='ck-title d-flex'>
                            {selectedWh && selectedWh.warehouseID ?
                                <React.Fragment>
                                    <div style={{ borderRight: '1px solid black', paddingRight: 10, width: 300 }}>
                                        {`${selectedWh.warehouseID}`}
                                    </div>
                                    <div style={{ paddingLeft: 10 }}>
                                        {`${selectedWh.originID}`}
                                    </div>
                                </React.Fragment>
                                :
                                <div style={{ borderRight: '1px solid black', display: 'none' }} />
                            }
                        </div>
                        <div className='ck-context'>
                            {
                                selectedWh
                                    ? (selectedWh && whConfig[selectedWh.warehouseID] && Object.keys(whConfig[selectedWh.warehouseID].products).map((key, index) => (
                                        <div role="button" key={index} onClick={() => handleWhToggleTag(key)} style={{ backgroundColor: selectedPT.includes(key) ? '#4a4444' : 'transparent' }}
                                        >
                                            {key}
                                        </div>
                                    )))
                                    : (selectedSku.length > 0 && whConfig
                                        ? (
                                            Object.values(whConfig).map((warehouse, warehouseIndex) => {
                                                return getDataByTag(warehouse.products, selectedPT).map((item, itemIndex) => {
                                                    return (
                                                        <div className='d-flex flex-column' key={`${warehouseIndex}-${itemIndex}`} width='100%' onClick={() => selectWhifEmpty(warehouse)}>
                                                            <div className='d-flex flex-row justify-content-between'>
                                                                <div>
                                                                    {` ${warehouse.name_id}`}
                                                                </div>
                                                                <div>
                                                                    {`${item.product_tag}`}
                                                                </div>
                                                            </div>
                                                            <div className='d-flex flex-row justify-content-between'>
                                                                <div className='d-flex flex-row justify-content-around ml-2' style={{ width: '100%' }}>
                                                                    <div>{item.unit_fee}</div>
                                                                    <div>{item.storage_fee}</div>
                                                                    <div>{item.pick_and_pack_fee}</div>
                                                                    <div>{item.storage_fee}</div>
                                                                </div>
                                                                <div style={{ fontWeight: 'bold' }}>
                                                                    {`  ${item.unit_fee + item.storage_fee + item.pick_and_pack_fee}`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                });
                                            })
                                        )
                                        : WarehousesSort({ warehouses: whConfig })
                                            .filter(wh =>
                                                uiShipping.country && uiShipping.country.length > 0 ? whConfig[wh.warehouseID].countries_to_ship.includes(uiShipping.country) : true)
                                            .map((wh, index) => (
                                                <div key={index} onClick={() => setSelectedWh(wh)}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                                        <div>
                                                            {wh.warehouseID}
                                                        </div>
                                                        <div>
                                                            {wh.originID}
                                                        </div>
                                                    </div>
                                                </div>
                                            )))
                            }
                        </div>
                        {selectedWh ?
                            <div className='d-flex flex-start dropup'>
                                <SearchContent></SearchContent>
                                <Button style={{ fontSize: 24, paddingBottom: 2 }} onClick={themometerOff} title="Deselect All"><i className="bi bi-thermometer"></i></Button>
                                <Button style={{ fontSize: 24, paddingBottom: 2 }}><i onClick={themometerOn} className="bi bi-thermometer-high" title="Select All"></i></Button>
                            </div>
                            : selectedSku.length > 0 ? <div className='d-flex justify-content-around'> WH Fees: Unit | Storage | Pick n Pack | Custom | Total </div> :
                                null}
                    </div>
                </div>


                <div id='skus'>
                    <div className='ck-container'>
                        <div className='ck-helloword'>SKUS</div>
                        <div className='ck-search-bar'>
                            <SearchBar
                                options={allSku.filter(sku => !selectedSku.some(selected => selected.name_id === sku.name_id))}
                                label="Select SKU"
                                onChange={(event, newValue) => {
                                    setSelectedSku([...selectedSku, newValue]);
                                }}
                            />
                            <div className="btn" onClick={() => handleReset('sku')}>
                                <i className="bi bi-repeat"></i>
                            </div>
                        </div>
                        <div className='ck-title d-flex'>
                            {selectedSku && selectedSku.length > 0 ? (
                                <div className='ck-title-row' style={{ padding: 0 }}>
                                    {selectedSku.map((sku, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setSelectedSku(selectedSku.filter(selected => selected.name_id !== sku.name_id));
                                                setSelectedPT(selectedPT.filter(selected =>
                                                    selected !== sku.product_tag)
                                                );
                                            }}
                                        >
                                            <div className='ck-context' style={{ padding: 0, margin: 0 }}>
                                                <div>
                                                    {sku.name_id} {sku.description}
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ display: 'none' }} />
                            )}
                        </div>

                        <div className='ck-context'>
                            {selectedWh && whConfig[selectedWh.warehouseID] ? (
                                allSku
                                    .filter(sku => Object.keys((whConfig[selectedWh.warehouseID]).products).includes(sku.product_tag)
                                        && !selectedSku.includes(sku)
                                        && selectedPT.includes(sku.product_tag))
                                    .map((sku, index) => (
                                        <div key={index} onClick={() => setSelectedSku([...selectedSku, sku])}>
                                            {sku.name_id} {sku.description}
                                        </div>
                                    ))
                            ) : (
                                allSku.filter(sku => !selectedSku || !selectedSku.some(selected => selected.name_id === sku.name_id)).map((sku, index) => (
                                    <div key={index} onClick={() => setSelectedSku([...selectedSku, sku])}>
                                        {sku.name_id} {sku.description}
                                    </div>
                                ))
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <div className='d-footer'>
                <div className='d-flex'>

                    <div className='d-flex flex-row  justify-content-end align-items-baseline'
                        style={{ color: CalcOutput.toWarehouseMargin === 0 ? 'grey' : 'white' }}
                    >
                        Gross Margin
                        <div
                            className='d-target'
                        >
                            {CalcOutput.toWarehouseMargin.toFixed(1)} %
                        </div>
                    </div>
                    <div className='d-flex flex-row justify-content-between align-items-baseline flex-end'
                        style={{ color: CalcOutput.toConsumerMargin === 0 ? 'grey' : 'white' }}
                    >
                        Contribution Margin
                        <span
                            className='d-target'
                        >
                            {CalcOutput.toConsumerMargin.toFixed(1)} %
                        </span>
                    </div>

                </div>
                <div className='d-flex justify-content-end align-items-baseline' style={{ paddingLeft: 40 }}>
                    <div className='d-flex flex-row justify-content-between align-items-baseline'
                        style={{ color: CalcOutput.priceWithoutDiscount === 0 ? 'grey' : 'white', width: '100%' }}
                    >
                        Pricing NO Discount
                        <span
                            className='d-target'
                        >
                            {CalcOutput.priceWithoutDiscount.toFixed(2)}
                        </span>
                    </div>
                    <div className='d-flex flex-row justify-content-between align-items-baseline'
                        style={{ color: (uiDC === 0 || uiDC === '') ? 'grey' : 'white' }}
                    >
                        Pricing WITH Discount
                        <span
                            className='d-target'
                        >
                            {CalcOutput.priceWithDiscount.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div >
    )
}
