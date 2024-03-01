import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Form, Dropdown, Button, ButtonGroup, Col } from 'react-bootstrap';

import { CSVLink } from 'react-csv';

//to upload get title add .xlsx and post to api
export const SearchBar = ({ title, titlecount, data, search, setSearch }) => {


    return (
        <div className="d-flex justify-content-between p-2 mt-2">
            <h1 style={{ fontFamily: 'Roboto', paddingTop: 16 }} >
                {title} : {titlecount}</h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px' }}>
                <searchbar style={{ padding: 5 }}>
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
                </searchbar>
                <button className="btn btn-dark"
                    style={{ marginLeft: '10px', fontSize: '20px',textAlign: 'center' }}
                    title={`Upload CSV: '${title}'`}>
                    <i class="bi bi-upload"></i>
                </button>
                <CSVLink className="btn btn-dark"
                    style={{ marginLeft: '10px', fontSize: '20px', paddingTop: 19 }}
                    title={`Download CSV:'${title}'`}
                    filename={title}
                    data={data}
                >
                    <i class="bi bi-cloud-download"></i>
                </CSVLink>
            </div>
        </div>
    )
}
