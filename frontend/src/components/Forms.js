import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react'
import React, { useForm } from 'react-hook-form';

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../AppGrid.css';



export const InputForm = () => {
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const [productTags, setProductTags] = React.useState([]);

    const handleProductTagChange = (event) => {
        setProductTags(event.target.value);
    };

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = data => {
      console.log(data);
    };

    
    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    }

    const onFirstDataRendered = (params) => {
        params.api.sizeColumnsToFit();
    }

    useEffect(() => {
        fetch('http://localhost:8000/psku')
            .then(result => result.json())
            .then(rowData => setRowData(rowData))
            .catch(err => console.log(err));

        setColumnDefs([
            { field: 'name_id', sortable: true, filter: true, checkboxSelection: true },
            { field: 'product_tag', sortable: true, filter: true },
            { field: 'total_cost', sortable: true, filter: true },
            { field: 'skus', sortable: true, filter: true },
        ]);
    }, []);

    return (
        <div>
            <div className="ag-theme-quartz" style={{ height: 400, width: 600 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    onFirstDataRendered={onFirstDataRendered}
                    rowSelection="multiple"
                />
            </div>
            <div>

            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="firstName">First Name</label>
                <input name="firstName" ref={register({ required: true })} />
                {errors.firstName && <p>This field is required</p>}

                <label htmlFor="lastName">Last Name</label>
                <input name="lastName" ref={register({ required: true })} />
                {errors.lastName && <p>This field is required</p>}

                <label htmlFor="email">Email</label>
                <input name="email" ref={register({ required: true })} />
                {errors.email && <p>This field is required</p>}

                <input type="submit" />
            </form>

        </div>
    );
}