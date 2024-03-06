import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';
import { Form, Dropdown, Button, ButtonGroup } from 'react-bootstrap';
import { getData, vendorData, setVendorData, mySku, useSkuForm, productTag, setProductTag, generatePId } from './CskuForm';
import { SearchBar } from './SearchBar'

export const NavPskuBar = ({ productTag, setPT, LinkSkuBtn, pskuId, setPskuId, pDes, setPDes }) => {

    const [pskuNames, setPskuNames] = useState([]);
    const { pskuData, setPskuData } = useSkuForm();
    const [selectedTag, setSelectedTag] = useState(null);
    const [isValidPskuName, setIsValidPskuName] = useState();

    const handlePskuIdChange = (event) => {
        const value = event.target.value
        console.log(value)
        if (pskuNames.includes(value) || pskuId.length == 0) {
            setIsValidPskuName(false)
        }
        else {
            setIsValidPskuName(true)
        }

        setPskuId(value);
    }

    useEffect(() => {
        if (pskuNames.includes(pskuId) || !pskuId)
            setIsValidPskuName(false)
        else
            setIsValidPskuName(true)
    })

    useEffect(() => {
        if (pskuData) {
            setPskuNames(pskuData.map(item => item.name_id));
        }
    }, [pskuData]);

    const handleTagChange = (event) => {
        setPT(event.target.value);
    };

    return (
        <div className='d-flex flex-row g-2 flex-start mt-0'>
            <div className="col-3">
                <div className='d-flex g-2'>

                    <select value={selectedTag} onChange={handleTagChange} className="form-select">
                        <option value="">PSKU Product Tag</option>
                        {productTag.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                    <Button variant='secondary' onClick={LinkSkuBtn}>
                        <i class="bi bi-card-heading"></i>
                    </Button>
                </div>
            </div>

            <div className='col-4' style={{ marginLeft: 10 }} >

                <Form.Group controlId="description">
                    <Form.Control
                        type="text"
                        name="description"
                        value={pDes}
                        onChange={(event) => setPDes(event.target.value)}
                        placeholder="PSKU Description"
                        style={{ backgroundColor: pDes.length ? 'white' : 'grey', boxSizing: 'border-box' }}
                        className='p-2'
                        required
                    />
                </Form.Group>
            </div>
            <div style={{ display: 'flex', marginLeft: 'auto', marginRight: 5 }}>
                <Form.Group controlId="pskuid">
                    <Form.Control
                        type="text"
                        name="pskuid"
                        value={pskuId}
                        onChange={handlePskuIdChange}
                        placeholder="PSKU ID"
                        style={{ backgroundColor: isValidPskuName ? 'white' : 'rgba(225, 0, 0, 0.6)' }}
                        required
                    />
                </Form.Group>
            </div>
        </div>
    );
};


export const GridPsku = () => {
    const [search, setSearch] = useState('');
    const { vendorData, productTag, setProductTag } = useSkuForm();
    const [selectedTag, setSelectedTag] = useState(null);
    const [pskuSelect, setPskuSelect] = useState([]);
    const [skuNames, setSkuNames] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [focusIndex, setFocusIndex] = useState(1);
    const [pskuId, setPskuId] = useState(generatePId())
    const [pskuNames, setPskuNames] = useState([])
    const [showPostMessage, setShowPostMessage] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    const [selectedNames, setSelectedNames] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [rowData, setRowData] = useState([])
    const [colData, setColData] = useState([
        {
            headerName: 'PSKU ID', field: 'name_id', minWidth: 100,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,

        },
        {
            headerName: 'CSKU IDS',
            field: 'skus',
            minWidth: 200,
            valueFormatter: params => params.value ? params.value.join(' ') : ''
        },
        { headerName: 'Cogs €', field: '_total_cogs', minWidth: 60 },
        { headerName: 'Weight KG', field: '_total_weight', minWidth: 60 },
        { headerName: 'Product Tag', field: 'product_tag', width: 140 },
        { headerName: 'Description', field: 'description', width: 120, editable: true },
    ])


    useEffect(() => {
        const promise = getData('psku', 'value')
        promise.then(data => {
            setRowData(data)
        }).catch(e => {
            console.error('uncaught promise amigomio')
        })
    }, [])

    const handleRemoveLink = (nameToRemove) => {
        setSelectedNames(selectedNames.filter(name => name !== nameToRemove));
    };


    useEffect(() => {
        if (rowData) {
            setPskuNames(rowData.map(item => item.name_id));
        }
    }, [rowData]);


    window.ptr = vendorData
    window.row = pskuNames
    window.pt = productTag
    window.skus = skuNames
    window.www = pskuSelect


    useEffect(() => {
        getData('sku', 'value').then(data => {
            const nameIds = data.map(item => item.name_id);
            setSkuNames(nameIds);
        });
    }, []);


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


    function addSkuInput(name) {
        if (name && name != '[object Object]') {
            console.log(typeof (name));
            window.name = name
            const str = name.toString();
            const names = str.split(',');
            setPskuSelect(prevPskuSelect => [...prevPskuSelect, ...names]);
        }
        else {
            setPskuSelect(prevPskuSelect => [...prevPskuSelect, '']);
            setFocusIndex(pskuSelect.length);
        }
    }

    const handlePid = () => {
        setPskuId(generatePId())
    }

    const handleDelete = (index) => {
        setPskuSelect(prevPskuSelect => {
            const newPskuSelect = [...prevPskuSelect];
            newPskuSelect.splice(index, 1);
            return newPskuSelect;
        });
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }
    const handleSkuSelect = (newSelectedNames) => {
        setSelectedNames(newSelectedNames);
    }


    const PskusInputs = React.memo(({ value, focus }) => {

        const inputRef = useRef();

        useEffect(() => {
            if (focus) {
                inputRef.current.focus();
            }
        }, []);

        const [style, setStyle] = useState({ backgroundColor: 'none' });

        const handleBlur = (event) => {
            if (!pskuNames.includes(value) && event.target.value.startsWith('P')) {
                setStyle({ border: '2px solid green' });
            } else {
                setStyle({ border: '2px solid red' });
            }
        };

        const handlePskuChange = (event) => {
            inputRef.current.focus();
            setPskuId(event.target.value);
        }

        return (
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handlePskuChange}
                onBlur={handleBlur}
                color='white'
                style={style}
            />
        );
    });

    const handleSubmit = () => {

        if (selectedNames.length === 0) {
            setShowPostMessage(true);
            setTimeout(() => {
                setShowPostMessage(false);
            }, 3000);
            return;
        }

        const data = {
            name_id: pskuId,
            skus: selectedNames,
            product_tag: selectedTag
        };
        console.log(data);

        axios.post('http://localhost:8000/psku', data)
            .then(response => {
                console.log(response);
                setRowData([...rowData, data]);
            })
            .catch(error => {
                console.log(error);
            });

        setPskuSelect([]);
        setSelectedNames([]);
        setSelectedTag(null);
        setPskuId(generatePId());
    }

    const handleCellValueChanged = async (event) => {
        try {
            for (let key in event.data) {
                if (event.data[key] === undefined || event.data[key] === null) {
                    console.error(`Error: ${key} is empty`);
                    return;
                }
            }
            const data = {
                name_id: event.data.name_id,
                product_tag: event.data.product_tag,
                skus: event.data.skus,
                description: event.data.description,
            };

            const response = await axios.patch(`http://localhost:8000/psku/${event.data.name_id}`, data);
        } catch (error) {
            console.error('Error updating PSKU data:', error);
        }
    }


    return (
        <div className="ag-theme-quartz-dark" style={{ height: '85vh', width: 1270 }}>

            <SearchBar title='PSKU' titlecount={rowData.length} search={search} setSearch={setSearch} data={rowData} setData={setRowData} selectedRows={selectedRows} />
            <AgGridReact
                onGridReady={onGridReady}
                columnDefs={colData}
                defaultColDef={{ flex: 1, filter: true, sortable: true, floatingFilter: true }} rowData={rowData}
                onCellValueChanged={handleCellValueChanged}
                onSelectionChanged={onSelectionChanged}
                onRowClicked={onRowClicked}
                suppressRowClickSelection={true}
                animateRows={true}
                rowSelection={'multiple'}
            />

            {showPostMessage && (
                <div className="alert alert-warning" role="alert">
                    You have no SKUs to display. Please add a SKU.
                </div>
            )}

        </div>
    );
};

