import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { Form,  Button, Col } from 'react-bootstrap';
import PskuForm from './PskuForm';
import { getData,  mySku, generatePId, useSkuForm } from './CskuForm';
import SkuLink from './SkuLink';
import MyModal from './MyModal';
import { NavPskuBar } from './PskuView';

export const SkuForm = ({ addSku, rowData }) => {

    const [showPskuBar, setShowPskuBar] = useState(false);
    const [pskuDes, setPskuDes] = useState('')
    const sku_names = rowData.map(row => row.name_id);
    const { pskuData, setPskuData } = useSkuForm();
    const [formData, setFormData] = useState(mySku);
    const [formDataArray, setFormDataArray] = useState([]);
    const [nextIndex, setNextIndex] = useState(0);

    const [pskuId, setPskuId] = useState(generatePId())

    const [vendorData, setVendorData] = useState([])
    const [productTag, setProductTag] = useState([])
    const [isLoadingVendors, setIsLoadingVendors] = useState(false);
    const [selectedProductTag, setSelectedProductTag] = useState(null);

    const [isFormValidated, setIsFormValidated] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showSkuMessage, setShowSkuMessage] = useState(false);
    const [showPskuMessage, setShowPskuMessage] = useState(false);
    
    // const [successMessage, setSuccessMessage] = useState(''); //todo
    // const [isValidPskuName, setIsValidPskuName] = useState(false);
    const [isValidName, setIsValidName] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedNames, setSelectedNames] = useState([]);

    const [pskuPost, setPskuPost] = useState([]);
    const [pskuNames, setPskuNames] = useState([]);

    const [missingFields, setMissingFields] = useState([]);

    {
        missingFields.length > 0 && (
            <Alert variant="danger">
                Please fill out the following fields: {missingFields.join(', ')}
            </Alert>
        )
    }

    const setCskuClick = () => {
        createNewFormEntry();
    }

    
    const setPskuClick = () => {
        if (showPskuBar) {
            setSelectedProductTag(null);
            setSelectedNames([])
            setFormDataArray([])
        }

        if (!showPskuBar) {
            let descriptions = [];

            if (formData.description) {
                descriptions.push(formData.description);
            }

            if (formDataArray) {
                formDataArray.forEach(item => {
                    if (item.description) {
                        descriptions.push(item.description);
                    }
                });
            }
            setPskuDes(descriptions.join(' '));

            if (formData.name_id && formDataArray.length === 0)
                setPskuId(formData.name_id)
        }
        setShowPskuBar(!showPskuBar);
    }


    useEffect(() => {
        if (pskuData) {
            setPskuNames(pskuData.map(item => item.name_id));
        }
    }, [pskuData]);
    window.dd = pskuNames;


    const createNewFormEntry = () => {
        const newEntry = {
            ...mySku,
            vendor_id: localStorage.getItem('lastSelectedVendor'),
            index: nextIndex
        };
        // window.scrollBy(0, 40)
        setFormDataArray(prevArray => [...prevArray, newEntry]);
    };

    const onRemoveMap = (indexToRemove) => {
        setFormDataArray(prevArray => {
            const newArray = [...prevArray];
            newArray.splice(indexToRemove, 1);
            return newArray;
        });
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }
    const handleSkuSelect = (newSelectedNames) => {
        setSelectedNames(newSelectedNames);
    }
    const handleAddLinks = () => {
        setShowModal(true);
    };
    const handleRemoveLink = (nameToRemove) => {
        setSelectedNames(selectedNames.filter(name => name !== nameToRemove));
    };

    //USE EFFECTS
    useEffect(() => {
        setNextIndex(formDataArray.length);
    }, [formDataArray]);

    useEffect(() => {
        if (!isLoadingVendors && vendorData.length > 0) {
            setFormData(prevFormData => ({
                ...prevFormData,
                vendor_id: prevFormData.vendor_id || vendorData[0].name_id,
            }));
        }
    }, [isLoadingVendors, vendorData]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingVendors(true);
            try {
                const [vendors, tags] = await Promise.all([
                    getData('vendor', 'value'),
                    getData('producttag', 'key')
                ]);
                setVendorData(vendors);
                setProductTag(tags);
            } catch (error) {
                console.error('Error fetching vendors or product tags', error);
            } finally {
                setIsLoadingVendors(false);
            }
        };
        fetchData();
    }, []);


    //HANDLERS
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (name === 'vendor_id') {
            localStorage.setItem('lastSelectedVendor', value);
            formData.vendor_id = value;
        }
        if (name === 'name_id' && formData.name_id.length > 0)
            (value && sku_names.map(name => name.toLowerCase()).includes(value.toLowerCase())) ? setIsValidName(false) : setIsValidName(true);
    };

    const doPsku = () => {
        let skuNames = [];

        skuNames.push(formData.name_id);
        if (formDataArray.length > 0)
            for (let i = 0; i < formDataArray.length; i++)
                skuNames.push(formDataArray[i].name_id);

        if (selectedNames.length > 0)
            for (let i = 0; i < selectedNames.length; i++)
                skuNames.push(selectedNames[i]);

        const psku = [
            {
                skus: skuNames,
                product_tag: selectedProductTag,
                description: pskuDes,
                name_id: pskuId
            }
        ];
        return apiDoPsku(psku)
    }

    const apiDoPsku = async (pskuPost) => {
        console.log('here we are: ', pskuPost[0])
        try {
            const response = await axios.post('http://localhost:8000/psku', pskuPost[0]);
            console.log('good doo api success')
            return true

        } catch (error) {
            console.error('There was a POST-PSKU error!', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ((formData.name_id.length === 0) && (!showPskuBar)) {
            setShowSkuMessage(true);
            setTimeout(() => {
                setShowSkuMessage(false);
            }, 3000);
            return
        }

        if ((!pskuDes || !pskuId || !selectedProductTag) && showPskuBar)
            return

        formData.vendor_id = localStorage.getItem('lastSelectedVendor');

        if (!selectedNames || !showPskuBar)
        {
            console.log('hi')
            const newMissingFields = Object.keys(formData).filter(key => !formData[key]);
            setMissingFields(newMissingFields);
    
            if (newMissingFields.length > 0) {
                setMissingFields(newMissingFields);
                setIsFormValidated(true)
                return;
            }

        }

        if (!formData.first_mile || formData.first_mile < 0)
            formData.first_mile = 0;

        try {
            const do_response = async (form) => {
                try{
                    // console.log('printing. . . . ')
                    // console.log(form)
                    const response = await axios.post('http://localhost:8000/sku', form);
                    if (addSku)
                        addSku(response.data);
                }
                catch (error) {
                    console.error('There was a POST2 error!', error);
                }
            }
            if (formData.name_id)
                do_response(formData);
            for (let i = 0; i < formDataArray.length; i++)
                do_response(formDataArray[i]);

            if (selectedProductTag)
                doPsku()
            
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
            
            setFormData({
                vendor_id: '',
                name_id: '',
                description: '',
                cogs: '',
                first_mile: '',
                weight_kg: '',
            });
            
            setShowPskuBar(false)
            setPskuDes('')
            setPskuId(generatePId())
            setIsFormValidated(false)
            setSelectedProductTag(false)
            setSelectedNames([])
            setFormDataArray([])
            setPskuPost([])
            isValidName(true)

        }
        catch (error) {
            console.error('There was a POST error!', error);
        }
    };

    window.p = formData;
    window.product = selectedProductTag;
    window.pp = formDataArray;
    window.pt = selectedProductTag
    window.post = pskuPost;
    window.d = pskuDes

    return (
        <div className='p-1'>
            <div className='my-son'>

                {showPskuBar && (
                    <NavPskuBar setPT={setSelectedProductTag} productTag={productTag} AddSkuBtn={createNewFormEntry} LinkSkuBtn={handleAddLinks} pskuId={pskuId} setPskuId={setPskuId} pDes={pskuDes} setPDes={setPskuDes} />
                )}
            </div>

            <div className="mt-4 border rounded-top border-secondary p-2 form-font" >
                {showSuccessMessage && (
                    <div className="alert alert-success mt-2" role="alert">
                        SKUS has been added successfully!
                    </div>
                )}
                {showPskuMessage && (
                    <div className="alert alert-success mt-2" role="alert">
                        Parent SKU has been added successfully!
                    </div>
                )}
                {showSkuMessage && (
                    <div className="alert alert-warning mt-2" role="alert">
                        Child Sku ID must be unique.
                    </div>
                )}


                <Form onSubmit={handleSubmit}>
                    <div className="row g-2">
                        <Col md={1}>
                            <Form.Group controlId="name_id" style={{ textAlign: 'left' }}>
                                <Form.Label>SKU ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name_id"
                                    value={formData.name_id}
                                    onChange={handleChange}
                                    placeholder="NEW ID"
                                    isInvalid={isFormValidated && !formData.name_id && !isValidName}
                                    isValid={isFormValidated && formData.name_id && isValidName}
                                    style={{ backgroundColor: isValidName ? 'white' : 'rgba(225, 0, 0, 0.6)' }}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group controlId="vendor_id" style={{ textAlign: 'left' }}>
                                <Form.Label className="form-label">Vendor's ID</Form.Label>
                                {isLoadingVendors ? (
                                    <div>No vendors to show ...</div>
                                ) : (
                                    <Form.Select
                                        name="vendor_id"
                                        value={isLoadingVendors ? '' : (localStorage.getItem('lastSelectedVendor') || (vendorData[0] && vendorData[0].name_id) || 'NO vendors available!')}
                                        onChange={handleChange}
                                        isInvalid={isFormValidated && !formData.vendor_id}
                                        isValid={isFormValidated && formData.vendor_id}
                                        required
                                    >
                                        {vendorData.map((vendor) => (
                                            <option key={vendor.name_id} value={vendor.name_id}>
                                                {vendor.name_id}
                                            </option>
                                        ))}
                                    </Form.Select>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group className="form-group is-valid" controlId="description" style={{ textAlign: 'left' }}>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Description"
                                    isInvalid={isFormValidated && !formData.description}
                                    required
                                    isValid={isFormValidated && formData.description}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group controlId="cogs" style={{ textAlign: 'left' }}>
                                <Form.Label>COGS</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="cogs"
                                    value={formData.cogs}
                                    onChange={handleChange}
                                    placeholder="COGS"
                                    isInvalid={isFormValidated && !formData.cogs}
                                    isValid={isFormValidated && formData.cogs}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={1}>
                            <Form.Group controlId="first_mile" style={{ textAlign: 'left' }}>
                                <Form.Label>First Mile</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="first_mile"
                                    value={formData.first_mile}
                                    onChange={handleChange}
                                    placeholder="€"
                                    isInvalid={isFormValidated && !formData.first_mile}
                                    isValid={isFormValidated && formData.first_mile}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={1}>
                            <Form.Group controlId="weight" style={{ textAlign: 'left' }}>
                                <Form.Label>Weight</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="weight_kg"
                                    value={formData.weight_kg}
                                    onChange={handleChange}
                                    isInvalid={isFormValidated && !formData.weight_kg} // Apply 'is-invalid' class
                                    isValid={isFormValidated && formData.weight_kg} // Apply 'is-invalid' class
                                    placeholder="KG"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={1}>

                            <Button variant='dark' className='hover-orange' onClick={setCskuClick}>
                                Add CSKU
                            </Button>

                        </Col>
                        <Col md={1}>

                            <Button
                                variant={showPskuBar ? 'primary' : 'dark'}
                                className={!showPskuBar ? 'hover-orange' : 'hov-blue'}
                                type="submit"
                                onClick={(event) => {
                                    event.preventDefault();
                                    setPskuClick();
                                }}
                            > Set PSKU
                            </Button>
                        </Col>
                        <Col md={1}>
                            <Button variant='light'  type="submit" onClick={handleSubmit} className='hover-orange' style={{paddingLeft: 6}}>
                                Submit
                                {/* <i class="bi bi-plus-square-fill"></i> */}
                            </Button>
                        </Col>

                        {nextIndex >= 0 && (
                            formDataArray.map((formData, index) => (
                                <PskuForm key={index} pskuData={formData} setPskuData={setFormDataArray} index={index} onRemove={onRemoveMap} />
                            ))
                        )}

                        {selectedNames.map((name, index) => (
                            <SkuLink key={index} name={name} onClick={() => { handleRemoveLink(name); }} />
                        ))}
                    </div>
                </Form >

                <MyModal
                    isOpen={showModal}
                    skuNames={sku_names}
                    selectedNames={selectedNames}
                    onClose={handleCloseModal}
                    onSelectSku={handleSkuSelect}
                />
            </div >
        </div>

    );
};

/*
{selectedProductTag ?
    <ButtonGroup vertical>
        <Form.Control type='text' value={pskuId} onChange={handlePskuIdChange} className='mt-1 btn btn-secondary'
                style={{ backgroundColor: isValidPskuName ? 'transparent' : 'rgba(225, 0, 0, 0.6)' }}
        />
        <Button variant={selectedProductTag ? 'primary' : 'success'} type="submit" onClick={handleSubmit} className='mt-1 d-flex justify-content-center align-items-center hover-orange-dark' style={{ height: 30 }}>
            <i className="bi bi-airplane-engines" style={{ fontSize: 24 }}></i>
        </Button>
    </ButtonGroup>
    :
}



                 {selectedProductTag && (
   
                    )}


    {selectedProductTag && (
                            <Col md={1}>
                                <div className="text-end">
                                    <Button
                                        className='mt-1 bg-secondary hover-border-blue'
                                        style={{ width: '80px', height: 35, border: 'none' }}
                                        onClick={createNewFormEntry}
                                    >
                                        <p>Add</p>
                                    </Button>
                                    <Button className='mt-1 bg-secondary hover-border-blue' style={{ width: '80px', height: 35, 'border': 'none' }}
                                        onClick={handleAddLinks}>
                                        <p>Link</p>
                                    </Button>
                                </div>

                            </Col>
                        )}




<Col md={1}>
<div className="text-end">
    <Button
        className='mt-1 bg-secondary hover-border-blue'
        style={{ width: '80px', height: 35, border: 'none' }}
        onClick={createNewFormEntry}
    >
        <p>Add</p>
    </Button>
    <Button className='mt-1 bg-secondary hover-border-blue' style={{ width: '80px', height: 35, 'border': 'none' }}
        onClick={handleAddLinks}>
        <p>Link</p>
    </Button>
</div>

</Col>



</Col>
<Col md={1}>
<ButtonGroup vertical>
    <Form.Control type='text' value={submitId} onChange={handlePskuIdChange} className='mt-1 btn btn-secondary'
        style={{ backgroundColor: submitId ? 'transparent' : 'rgba(225, 0, 0, 0.6)', height: 32 }}
    />

</ButtonGroup>

*/
