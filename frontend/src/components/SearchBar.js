import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Form, Dropdown, Button, ButtonGroup, Col } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import axios from 'axios';

//to upload get title add .xlsx and post to api
export const SearchBar = ({ title, titlecount, data, setData, search, setSearch, selectedRows }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const deleteSelectedRows = async () => {
        try {
            const lowerCaseTitle = title.toLowerCase();
            const promises = selectedRows.map(row => axios.delete(`http://localhost:8000/${lowerCaseTitle}/${row.name_id}`));
            await Promise.all(promises);
            const newData = data.filter(d => !selectedRows.some(row => row.name_id === d.name_id));
            setData(newData);
        } catch (error) {
            console.error('Error deleting rows:', error);
        }
    };
    
    function transformBack(header) {
        if (header.endsWith('_')) {
            header = header.slice(0, -1) + '%';
        }
        if (header.startsWith('_')) {
            header = header.replace('_', '/');
        }

        header = header.replace(/_/g, ' ');
        header = header
            .split(' ')
            .map((word, index) => {
                if (word.charAt(0) === '/') {
                    return '/' + word.charAt(1).toUpperCase() + word.slice(2);
                } else {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
            }).join(' ');

        return header;
    }


    const handleExport = () => {
        const title_name = title + '.xlsx';
        if (!data)
            return;
        console.log('date me: ', data)
        const transformedData = data.map((row, index) => {
            let transformedRow = {};
            for (let key in row) {
                let value = row[key];
                if (typeof value === 'object' || value === '' || value === null) {
                    continue;
                }
                if (data[index + 1] && data[index + 1][key]) {
                    transformedRow[transformBack(key)] = value;
                }
            }
            return transformedRow;
        });

        const ws = XLSX.utils.json_to_sheet(transformedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, title_name);

        console.log('exported data complete:')
    }

    const handleImport = async () => {
        try {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.xlsx';
            fileInput.click();

            const filePromise = new Promise((resolve) => {
                fileInput.addEventListener('change', () => {
                    resolve(fileInput.files[0]);
                });
            });
            const file = await filePromise;
            if (file) {
                console.log('file:', file);
                const formData = new FormData();
                formData.append('file', file);
                formData.append('filename', title + '.xlsx');

                const response = await fetch('http://localhost:8000/upload', {
                    method: 'POST',
                    body: formData,
                });
                console.log('response: ', response);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }

    };

    const helloworld = (e) => {
        console.log('hello world', e.target.files[0]);
        setSelectedFile(e.target.files[0])
    }

    return (
        <div className="d-flex justify-content-between p-2 mt-2">
            <h1 style={{ fontFamily: 'Roboto', paddingTop: 16 }} >
                {title} :
                <span style={{ color: selectedRows.length > 0 ? 'grey' : 'white', marginLeft: 12 }}>
                    {selectedRows.length === 0 ? titlecount : selectedRows.length}
                </span>
            </h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px' }}>
                {
                    selectedRows.length > 0 &&
                    <Button
                        variant='danger'
                        className='dropdown'
                        style={{ opacity: 0.8, fontSize: '24px', height: 48, width: 49, marginRight: 20 }}
                        title='Delete Rows'
                        onClick={deleteSelectedRows}
                    >
                        <i className="bi bi-trash"></i>
                    </Button>
                }
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

{/* <searchbar style={{ padding: 5 }}>
    <ButtonGroup>
        <Form.Control
            type="text"
            placeholder="Filter"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
                backgroundColor: search ? 'white' : 'grey',
                borderColor: 'black'
            }}
            onFocus={e => e.target.style.backgroundColor = 'white'}
            onBlur={e => e.target.style.backgroundColor = 'grey'}
        />                        <Button variant='dark'>
            <i className="bi bi-search"></i>
        </Button>
    </ButtonGroup>
</searchbar> */}