import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../App.css';


export const Calculate = (warehouse, psku, shipping) => {
    console.log('runing.....')
    console.log('warehouse', warehouse);
    console.log('psku', psku);
    console.log('shipping', shipping);


    let rtn = 21;



    return rtn;

}


/*
(total product cost + total warehouse cost + total shipping cost)/( 1- objective margin – tax – payment processing consumer – marketing cost)
*/