import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

import '../AppGrid.css';
import Alert from '@mui/material/Alert';
import { SearchBar } from './SearchBar'
import { getData } from './CskuForm'
import { Button } from 'react-bootstrap'


export function toTitleCase(str) {
    return str.replace('_', ' ').replace(/(?:^|\s)\w/g, function (match) {
        return match.toUpperCase();
    });
}

const ParamProduct = {
    name_id: '',
}


export const ProductTag = () => {
    const [search, setSearch] = useState('');
    const [rowData, setRowData] = useState([])
    const [newTag, setNewTag] = useState('')
    const [showAlert, setShowAlert] = useState(false);


    useEffect(() => {
        getData('producttag').then(data => {
            setRowData(data)
        })
    }, []);

    const handleDelTag = async (name_id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/producttag/${name_id}`);
            setRowData(rowData.filter(tag => tag !== name_id));
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    }

    const handleAddTag = async () => {
        if (!newTag.trim())
            return;

        const nameTag = toTitleCase(newTag.trim());
        console.log(typeof (nameTag))
        if (rowData.includes(nameTag)) {
            setShowAlert(true);
            setNewTag('');
            return;
        }

        try {
            ParamProduct.name_id = nameTag;
            const response = await axios.post('http://localhost:8000/producttag', ParamProduct);
            setRowData([...rowData, nameTag]);
            setNewTag('');
        }
        catch (error) {
            console.error('There was a BIGFAT error!', error);
        }

    };

    const handleInputChange = (e) => {
        setNewTag(e.target.value);
        setShowAlert(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <div className="ag-theme-quartz-dark" style={{ height: 800, width: 1270 }}>
            <div className='container m-5' style={{ border: '1px solid black' }}>

                <main className='d-flex'>
                    <div className="col-md-4">
                        <h1>Product Tag</h1>
                        {rowData.map((tag, index) => (
                            <div key={index} className="col-md-10">
                                <div className="card p-1 pb-0 mb-2">
                                    <div className="d-flex justify-content-between align-items-baseline" style={{ fontSize: 24, alignItems: 'center', marginLeft: 9 }}>
                                        <p>{tag}</p>
                                        <Button className="btn btn-dark mb-1 mt-1" onClick={() => handleDelTag(tag)}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="col-md-10">
                            <div className="card mb-4">
                                <div className="row p-2">
                                    <div className="col-md-9 p-2 d-flex align-items-stretch">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Product Tag Name"
                                            value={newTag}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                        />
                                    </div>
                                    <div className="col-md-1 d-flex align-items-stretch" style={{ marginLeft: 16 }}>
                                        <button className="btn btn-primary" onClick={handleAddTag}><i class="bi bi-plus-square-fill"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex flex-start'>
                    </div>
                </main>

                <div className='row'>
                    {showAlert && (
                        <Alert severity="error" onClose={() => setShowAlert(false)}>
                            Product Tag already exists.
                        </Alert>
                    )}
                </div>
            </div>
        </div >
    );
};
