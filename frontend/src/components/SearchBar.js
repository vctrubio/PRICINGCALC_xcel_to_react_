import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Form, Dropdown, Button, ButtonGroup, Col } from 'react-bootstrap';



export const SearchBar = ({ title, titlecount, search, setSearch }) => {


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
                    style={{ marginLeft: '10px', fontSize: '20px' }}
                    title={`Download '${title}'`}>
                    <i class="bi bi-download"></i>
                </button>
                <button className="btn btn-dark"
                    style={{ marginLeft: '10px', fontSize: '20px', paddingTop: 8 }}
                    title={`Download '${title}'`}>
                    <i class="bi bi-cloud-upload"></i>
                </button>
            </div>

        </div>
    )
}
