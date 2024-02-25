import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../App.css';


const MyModal = ({ isOpen, skuNames, selectedNames, onClose, onSelectSku }) => {
    const [tempSelectedNames, setTempSelectedNames] = useState([...selectedNames]);
    const [searchTerm, setSearchTerm] = useState('');

    const inputRef = useRef();

    // useEffect(() => {
    //     inputRef.current.focus();
    // }, []);

    useEffect(() => {
        // Reset when the modal opens
        setTempSelectedNames([...selectedNames]);
    }, [isOpen]);

    const handleSkuClick = (skuName) => {
        setTempSelectedNames(prevNames => {
            if (prevNames.includes(skuName)) {
                return prevNames.filter(name => name !== skuName);
            } else {
                return [...prevNames, skuName];
            }
        });
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleConfirm();
        }
    };

    const handleConfirm = () => {
        onSelectSku(tempSelectedNames);
        onClose();
        setSearchTerm('')
    }

    const handleClose = () => {
        onClose();
        setSearchTerm('')
    }

    const unselectAll = () => {
        setTempSelectedNames([]);
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredSkuNames = skuNames.filter(skuName => skuName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Modal show={isOpen} onHide={handleClose} className='my-modal pt-2'>
            <Modal.Header closeButton>
                <div className='d-flex justify-content-around p2'>
                    <Modal.Title style={{ marginRight: '15px' }}>Select SKUs</Modal.Title>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search SKU"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ marginLeft: '5px' }}
                    />
                </div>
            </Modal.Header>

            <Modal.Body>
                {/* <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}> */}
                <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px' }}>
                    {filteredSkuNames.sort().map(skuName => (
                        <li key={skuName}>
                            <Button
                                variant={tempSelectedNames.includes(skuName) ? 'primary' : 'outline-primary'}
                                onClick={() => handleSkuClick(skuName)}
                                onKeyDown={handleKeyPress}
                            >
                                {skuName}
                            </Button>
                        </li>
                    ))}
                </ul>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="light" onClick={unselectAll}>
                    Deselect ALL
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default MyModal; // Export the modal component
