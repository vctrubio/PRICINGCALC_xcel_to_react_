import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Form, Dropdown, Button, ButtonGroup, Col } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';

//to upload get title add .xlsx and post to api
export const SearchBar = ({ title, titlecount, data, search, setSearch }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    function transformBack(header) {
        if (header.endsWith('_')) {
            header = header.slice(0, -1) + '%';
        }
        else if (header.startsWith('_')) {
            header = header.replace('_', '/')
        }

        header = header.replace(/_/g, ' ');
        header = header
            .split(' ')
            .map((word, index) => {
                if (word.charAt(0) === '/') {
                    return '_' + word.charAt(1).toUpperCase() + word.slice(2);
                } else {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
            }).join(' ');

        return header;
    }

    const handleExport = () => {
        const title_name = title + '.xlsx';

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
                {title} : {titlecount}</h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px' }}>
                <button className="btn btn-dark"
                    style={{ marginLeft: '10px', fontSize: '20px', textAlign: 'center' }}
                    title={`Upload: '${title}'`}
                    onClick={handleImport}
                >
                    <i class="bi bi-upload"></i>
                </button>
                <button className="btn btn-dark"
                    style={{ marginLeft: '10px', fontSize: '20px', paddingTop: 14 }}
                    title={`Download:'${title}'`}
                    onClick={handleExport}
                >
                    <i class="bi bi-cloud-download"></i>
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