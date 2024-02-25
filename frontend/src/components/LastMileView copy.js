import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';

import { getData, useSkuForm } from './CskuForm';
import { SkuForm } from './SkuForm';
import { Form, Button } from 'react-bootstrap';

const TitleBox = ({ title }) => {

    return (
        <div className='title-box'>
            <h1 style={{ textAlign: 'left', padding: '5px' }}>{title}</h1>

            <div className='d-flex justify-content-between' style={{ width: 300 }}>
                <button className='btn btn-primary ml-4' onClick={() => console.log('Button clicked')}>Add</button>
                <button className='btn btn-primary' onClick={() => console.log('Button clicked')}>ABB</button>

            </div>

        </div>
    )

}


const PskuRowView = (data) => {

    const ptr = data.data
    window.pr = ptr
    return (
        <div className='psku-card' style={{ marginBottom: 20, color: 'white', textAlign: 'left', padding: 5 }}>
            <div className='d-flex justify-content-between p-1 border-bottom border-light'>
                <div className='psku-card-title' style={{ height: 40, fontSize: 24 }}>
                    {ptr.name_id}
                </div>
                <div style={{ fontSize: 20, alignItems: 'center', paddingTop: 6, marginRight: 2 }}>
                    <i className="bi bi-box-seam-fill"> 1, 3, 4</i>
                    {/* <i class="bi bi-database-fill-up"> </i> */}
                </div>
            </div>

            <div className='d-flex psku-body'>
                {ptr.skus.map((i, index) => (
                    <div className='p-2'>
                        <p key={index}>{i}</p>
                    </div>
                ))}
            </div>
            <div className='psku-footer'>
                <div style={{ width: 180, textAlign: 'left', paddingLeft: 5 }}>
                    {ptr.product_tag}
                </div>
                <div style={{ width: 80, backgroundColor: '#14671c' }}>
                    {ptr.total_cost} €
                </div>
            </div>
        </div>
    )
}


const RightBar = () => {

    const { pskuData, setPskuData } = useSkuForm();
    const [btnState, setBtnState] = useState(true);

    window.pp = pskuData;

    return (
        <div style={{ fontFamily: 'Monaco' }}>
            <div className='title-right-bar' onClick={() => setBtnState(!btnState)}>
                PSKU</div>
            <div>
                {
                    btnState && pskuData.map((row, index) => (
                        <div key={index}>
                            <PskuRowView key={index} data={row} />
                        </div>
                    ))
                }
            </div>
            <div className='navbarGrid'>
                Warehouse</div>
            <div className='navbarGrid'>
                Provedores</div>
            {/* <div className='navbarGrid'>
                Warehouse</div> */}
            <div>

            </div>
        </div>
    )
}


const LastMileGrid = () => {
    const [rowData, setRowData] = useState([]) // Initialize with an empty array
    const [colData, setColData] = useState([
        { headerName: "Name", field: "name_id" } // Example column definition
    ])
  
    return (
        <div className='contana d-flex flex-row border'>
            <div className='d-flex flex-column' style={{ width: '100%', height: '100vh' }}>
                <TitleBox title='Last Mile' />
                <div className='ag-theme-quartz-dark border border-warning mb-2' style={{ width: '100%', height: 1220 }}>
                    <AgGridReact
                        columnDefs={colData}
                        rowData={rowData}
                        defaultColDef={{ flex: 1 }}
                    />
                </div>
                <div className='border border-success' style={{ width: '100%', height: 200 }}>
                    <SkuForm addSku={rowData} rowData={rowData} />
                    TWO
                </div>
            </div>
            <div className='rightbar-pos'>
                <RightBar></RightBar>
            </div>
        </div>
    )
}


export default LastMileGrid;
