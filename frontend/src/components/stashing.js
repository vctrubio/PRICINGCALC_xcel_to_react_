//b2b
+<div className='d-flex flex-column' style={{ width: '100%', paddingLeft: 4 }}>
    <div type='button' className='d-flex flex-row justify-content-between pb-1'
        onClick={() => setUiShipping(prevState => ({ ...prevState, b2c: !prevState.b2c }))}
    >
        <div className='d-flex' style={{ paddingLeft: 5 }}>
            {uiShipping.b2c ? 'B2C' : 'B2B'}
        </div>
        <div className='d-flex'>
            <img
                style={{ height: 24, width: 24, color: 'white', marginRight: 0 }}
                src={uiShipping.b2c ? switchOn : switchOff}
                alt="Switch"
            />
        </div>
    </div>
    <input className='input-secondary'
        type="number"
        placeholder='Discount %'
        value={uiDC}
        onChange={(e) => setUiDC(e.target.value)}
        style={{ backgroundColor: (uiDC === null || uiDC === '' || uiDC === '0') ? 'transparent' : '', width: '100%' }}
    />
</div>



//PackagingVendor
+<div className="ag-theme-quartz-dark" style={{ height: 700, width: 700, textAlign: 'left' }}>
                <SearchBar title='PackagingVendor' titlecount={rowData.length} search={''} setSearch={''} data={rowData} setData={setRowData} selectedRows={selectedRows} setRerender={setRerender}/>
                <AgGridReact
                    onGridReady={onGridReady}
                    columnDefs={colData}
                    defaultColDef={{ flex: 1, filter: true, sortable: true, floatingFilter: true }} rowData={rowData}
                    onCellValueChanged={handleCellValueChangedVendor}
                    onSelectionChanged={onSelectionChanged}
                    onRowClicked={onRowClicked}
                    suppressRowClickSelection={true}
                    animateRows={true}
                    rowSelection={'multiple'}
                >
                </AgGridReact>
                <div style={{ width: '100%', height: '4em', marginTop: '1em', paddingRight: 20 }}>
                    <Form onSubmit={handleSubmitVendor}>
                        <div className="row g-2">
                            <Col md={4}>
                                <Form.Group controlId="vendor_id" style={{ textAlign: 'left' }}>
                                    <Form.Label className="form-label">Vendor's ID</Form.Label>
                                    <Form.Select
                                        name="vendor_id"
                                        value={sendVendorPackaging.vendor_id}
                                        onChange={(e) => handleInputChangeVendor('vendor_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Vendor</option>
                                        {vendorData.map((vendor) => (
                                            <option key={vendor.name_id} value={vendor.name_id}>
                                                {vendor.name_id}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="product_tag" style={{ textAlign: 'left' }}>
                                    <Form.Label className="form-label">Product Tag</Form.Label>
                                    <Form.Select
                                        name="product_tag"
                                        value={sendVendorPackaging.product_tag}
                                        onChange={(e) => handleInputChangeVendor('product_tag', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Product Tag</option>
                                        {productTag.map((tag) => (
                                            <option key={tag.id} value={tag.id}>
                                                {tag}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="cost_of_packaging" style={{ textAlign: 'left' }}>
                                    <Form.Label className="form-label">Packaging</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="cost_of_packaging"
                                        placeholder='Fee €'
                                        value={sendVendorPackaging.cost_of_packaging}
                                        onChange={(e) => handleInputChangeVendor('cost_of_packaging', e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={1} className="d-flex align-items-end">
                                <Button variant="primary" type="submit" style={{ height: '65px' }}>
                                    <i className='bi bi-plus-square-fill' ></i>
                                </Button>
                            </Col>
                        </div>
                    </Form>
                </div>
            </div>