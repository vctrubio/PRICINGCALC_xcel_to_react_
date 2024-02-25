import React, { useEffect, useState } from 'react';
import { Button, TextField, Grid, FormHelperText, Select, MenuItem, FormControl, InputLabel, Paper } from '@material-ui/core';
import Box from '@mui/material/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { mySku, useSkuForm } from './CskuForm';


export const MenuSample = ({ addSku, rowData }) => {
  const [clientType, setClientType] = useState('');
  const [country, setCountry] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [cskuCombo, setCskuCombo] = useState('');
  const [psku, setPsku] = useState('');
  const [bundle, setBundle] = useState('');
  const [marketingPercentage, setMarketingPercentage] = useState('');
  const [returnsPercentage, setReturnsPercentage] = useState('');
  const [objectiveMargin, setObjectiveMargin] = useState('');
  const [consumerDiscount, setConsumerDiscount] = useState('');

  const handleCalculateClick = () => {
    // Perform calculations based on the form inputs
    // Output the results or update state variables accordingly
  };

  return (
    <Box>
      <form noValidate autoComplete="off">
        <div className='border border-success mt-5 row'>
          <div className='d-flex flex-column flex-sm-row sku-field-options col-md-6 col-sm-8'>
            <div className='sku-title-column'>
              <span className='sku-title'>Client Type</span>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="client-type-label">Client Type</InputLabel>
                <Select
                  labelId="client-type-label"
                  id="client-type"
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value)}
                >
                  <MenuItem value="B2C">B2C</MenuItem>
                  <MenuItem value="B2B">B2B</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {clientType === 'B2C' && (
            <div className='d-flex flex-column flex-sm-row sku-field-options col-md-9 col-sm-12'>
              <div className='sku-title-column'>
                <span className='sku-title'>Country</span>
                <TextField
                  id="outlined-basic"
                  label="Country"
                  variant="outlined"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              {/* Add other B2C-specific options here */}
            </div>
          )}

          <div className='sku-title-column'>
            <Button variant="contained" color="primary" onClick={handleCalculateClick}>
              Calculate
            </Button>
          </div>
        </div>

        {/* Display Pricing Breakdown here */}
        {/* ... (your pricing breakdown structure) */}
      </form>
    </Box>
  );
};