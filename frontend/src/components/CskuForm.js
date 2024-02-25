import React, { useEffect, useState } from 'react';
import { Form, Dropdown, Button, ButtonGroup, Col } from 'react-bootstrap';
import axios from 'axios';

export const mySku = {
    vendor_id: '',
    name_id: '',
    description: '',
    cogs: '',
    first_mile: '',
    weight_kg: ''
}

export function generatePId() {
    let str = "P0" + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return str;
}


export async function getData(model, v) {
    try {
        const response = await axios.get(`http://localhost:8000/${model}`);
        return v === 'value' ? Object.values(response.data) : Object.keys(response.data);
    } catch (error) {
        console.error('There was an error fetching data!', error);
    }
}

export const useSkuForm = () => {
    const [isFormValidated, setIsFormValidated] = useState(false);
    const [vendorData, setVendorData] = useState([])
    const [productTag, setProductTag] = useState([])
    const [pskuData, setPskuData] = useState([])

    const fetchData = async (model, v) => {
        try {
            const response = await axios.get(`http://localhost:8000/${model}`);
            return v === 'value' ? Object.values(response.data) : Object.keys(response.data);
        } catch (error) {
            console.error('There was an error fetching data!', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vendors, tags, psku] = await Promise.all([
                    getData('vendor', 'value'),
                    getData('producttag', 'key'),
                    getData('psku', 'value')
                ]);
                setVendorData(vendors);
                setProductTag(tags);
                setPskuData(psku)
            } catch (error) {
                console.error('Error fetching vendors tags', error);
            }
        };

        fetchData();
    }, []);

    window.ole = vendorData
    window.psku = pskuData

    return {
        isFormValidated,
        setIsFormValidated,
        mySku,
        fetchData,
        vendorData,
        setVendorData,
        productTag,
        setProductTag,
        pskuData, 
        setPskuData,
        getData
    };
};