
<Row>

                            <Col md={4}>
                                <Form.Group controlId="productTag" style={{ textAlign: 'left' }}>
                                    <Form.Label>Product Tag</Form.Label>
                                    <ButtonGroup style={{ width: '300px' }}>
                                        {!showInput && (
                                            <Dropdown >
                                                <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: '268px' }} >
                                                    {productTag[0]}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="align-dropdown-right">
                                                    {productTag.map((tag, index) => (
                                                        <Dropdown.Item key={index}>
                                                            <div className="text-center">{tag}</div>
                                                        </Dropdown.Item>
                                                    ))}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        )}
                                        {showInput && (
                                            <Form.Control
                                                type="text"
                                                name="productTag"
                                                value={warehouseData.productTag}
                                                onChange={handleInputChange}
                                                placeholder="Search or Create your own"
                                                style={{ width: '280px' }}
                                            />
                                        )}
                                        <Button onClick={() => setShowInput(!showInput)}>^</Button>
                                    </ButtonGroup>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group controlId="unitFee" style={{ textAlign: 'left' }}>
                                    <Form.Label>Unit Fee</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="unitFee"
                                        value={warehouseData.unitFee}
                                        onChange={handleInputChange}
                                        placeholder="Unit Fee"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group controlId="storageFee" style={{ textAlign: 'left' }}>
                                    <Form.Label>Storage Fee</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="storageFee"
                                        value={warehouseData.storageFee}
                                        onChange={handleInputChange}
                                        placeholder="Storage Fee"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group controlId="pickAndPackFee" style={{ textAlign: 'left' }}>
                                    <Form.Label>Pick and Pack Fee</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pickAndPackFee"
                                        value={warehouseData.pickAndPackFee}
                                        onChange={handleInputChange}
                                        placeholder="Pick and Pack Fee"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group controlId="pickAndPackFee" style={{ textAlign: 'left' }}>
                                    <Form.Label>Custom Fee</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Cusom Fee"
                                        value={warehouseData.pickAndPackFee}
                                        onChange={handleInputChange}
                                        placeholder="Custom Fee"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Button onClick={handleDlWhData}>Click me</Button>
                            </Col>
                        </Row>
                    )}
                    {/* <Col md={1}>
                            <Form.Group controlId="CalcTotal" style={{ textAlign: 'left' }}>
                                <Form.Label>Bocal</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="calcTotal"
                                    value={warehouseData.pickAndPackFee}
                                    onChange={handleInputChange}
                                    placeholder="..."
                                />
                            </Form.Group>
                        </Col> */}



// const PskuIdSelect = React.memo(({ index, value, focus }) => {

//     const [style, setStyle] = useState({ border: 'none' });
//     const inputRef = useRef();

//     useEffect(() => {
//         if (focus) {
//             inputRef.current.focus();
//         }
//     }, [index]);

//     const handleBlur = () => {
//         if (skuNames.includes(value)) {
//             setStyle({ border: '2px solid green' });
//         } else {
//             setStyle({ border: '2px solid red' });
//         }
//     };

//     const handleSkuChange = (index) => (event) => {
//         setPskuSelect(prevPskuSelect => {
//             const newPskuSelect = [...prevPskuSelect];
//             newPskuSelect[index] = event.target.value;
//             return newPskuSelect;
//         });
//         setFocusIndex(index);
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             addSkuInput();
//         }
//     };

//     return (
//         <input
//             ref={inputRef}
//             type="text"
//             placeholder={`csku #${index + 1}`}
//             name={index}
//             value={value}
//             onChange={handleSkuChange(index)}
//             onKeyPress={handleKeyPress}
//             className={'form-control'}
//             onBlur={handleBlur}
//             style={style}
//         />
//     );
// });
