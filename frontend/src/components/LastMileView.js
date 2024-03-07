import { useCallback, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';
import axios from 'axios';
import { getData, useSkuForm } from './CskuForm';
import { SkuForm } from './SkuForm';
import { Form, Button } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import { SearchBar } from './SearchBar';

const SelectionBar = ({ allCouriers, setCallBack, selectedCourier, setCourierType }) => {
    const handleClick = (courier) => {
        setCallBack(courier);
        setCourierType(null); // Reset courier type when a new courier is selected
    };

    return (
        <div className='my-flex' style={{ margin: 6 }}>
            {allCouriers &&
                allCouriers.map((courier) => (
                    <div key={courier?.name_id} id={courier?.name_id} onClick={() => handleClick(courier)}>
                        <div type='button' className='carglass'>
                            {courier?.name_id}
                        </div>

                    </div>
                ))}
        </div>
    );
};

const OneGrid = ({ rowData, colData }) => {
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [courierType, setCourierType] = useState(null);

    const allCouriers = [
        { name_id: 'DHL', type: ['Standard', 'Express'] },
        { name_id: 'FEDEX', type: ['Standard', 'Express'] },
        { name_id: 'UPS', type: ['Standard', 'Express'] },
    ];

    window.pp = selectedCourier
    window.pe = courierType

    const handleTypeClick = (type) => {
        setCourierType(type);
    };
    return (
        <div>
            <SelectionBar
                allCouriers={allCouriers}
                setCallBack={setSelectedCourier}
                selectedCourier={selectedCourier}
                setCourierType={setCourierType}
            />

            {selectedCourier && (
                <div className='d-flex justify-content-start' style={{ width: 150, height: 80, marginTop: 4, alignSelf: 'left' }}>
                    {selectedCourier &&
                        selectedCourier.type.map((type, index) => (
                            <Button key={index} type='button' className='d-flex flex-start justify-content-start hover-orange' onClick={() => handleTypeClick(type)} style={{ width: 150, height: 45, marginTop: 12, alignSelf: 'left' }}
                                variant={type == courierType ? 'dark' : 'light'}
                            >
                                {type}
                            </Button>
                        ))}
                </div>
            )}
        </div>
    );
};


const LastMileGrid = () => {
    const [gridApi, setGridApi] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [search, setSearch] = useState('');
    const [rowData, setRowData] = useState([])
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [colData, setColData] = useState(
        [
            {
                headerName: 'Courier', field: 'Courier', minWidth: 120,
                checkboxSelection: true,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true
            },
            { headerName: 'Type', field: 'Type', width: 80 },
            { headerName: 'Weight KG', field: 'Weight', width: 80 },
            {
                headerName: 'Zones', children: [
                    {
                        headerName: '1', valueGetter: function (params) {
                            return params.data['Zones']['zone_1'];
                        }
                    },
                    {
                        headerName: '2', valueGetter: function (params) {
                            return params.data['Zones']['zone_2'];
                        }
                    },
                    {
                        headerName: '3', valueGetter: function (params) {
                            return params.data['Zones']['zone_3'];
                        }
                    },
                ]
            },
        ]
    )

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData('shipping', 'value');
                window.f = response

                const rowData = [];

                response.forEach(courier => {
                    const name_id = courier.name_id;

                    Object.entries(courier.shipping_table).forEach(([service_type, shipping_table]) => {
                        Object.entries(shipping_table.price_zone).forEach(([weight, zones]) => {
                            const row = {
                                Courier: name_id,
                                Type: service_type,
                                Weight: weight,
                                Zones: {
                                    zone_1: zones.zone_1,
                                    zone_2: zones.zone_2,
                                    zone_3: zones.zone_3,
                                }
                            };
                            rowData.push(row);
                        });
                    });
                });
                setRowData(rowData)
            } catch (error) {
                console.error('There was an error fetching data!', error);
            }
        }
        fetchData();
    }, []);

    window.row = rowData
    window.t = selectedWarehouse


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


    //dropdown to show type.... 

    return (
        <div className="ag-theme-quartz-dark" style={{ height: 800, width: 1270 }}>
            <SearchBar title='Last Mile' titlecount={null} search={search} setSearch={setSearch} data={rowData} setData={setRowData} selectedRows={selectedRows} />

            {/* <div className='d-flex flex-start pb-2'>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="align-items-baseline" style={{ width: '256px', height: '38px', textDecoration: 'none', fontSize: 18, textAlign: 'left' }}>
                        {selectedWarehouse ? `${selectedWarehouse.name_id}` : 'Select Warehouse'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="align-dropdown-right">
                        {warehouses.map((warehouse, index) => (
                            <Dropdown.Item key={index} eventKey={warehouse}
                                onClick={() => handleSelect(warehouse)}>
                                <div className="text-center">{warehouse.name_id} - {warehouse.origin}</div>
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div> */}
            <h4>dropdown courier dropdown type</h4>
            <AgGridReact
                onGridReady={onGridReady}
                columnDefs={colData}
                rowData={rowData}
                defaultColDef={{ flex: 1, filter: true, sortable: true, floatingFilter: true }}
                onRowClicked={onRowClicked}
                suppressRowClickSelection={true}
                animateRows={true}
                rowSelection={'multiple'}
            />
        </div>
    )
}

export default LastMileGrid;


/*
    const warehouses = [
        { name_id: 'SwiftStore Warehousing', origin: 'Spain' },
        { name_id: 'Atlas Logistics Center', origin: 'France' },
        { name_id: 'Evergreen Distribution Hub', origin: 'Germany' },
        { name_id: 'Apex Fulfillment Services', origin: 'China' },
        { name_id: 'Horizon Storage Solutions', origin: 'California' }
    ];

    const handleSelect = (warehouse) => {
        console.log('warehouse: ', JSON.stringify(warehouse));
        setSelectedWarehouse(warehouse);
    };
*/