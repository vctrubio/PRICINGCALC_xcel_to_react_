import './App.css';
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import GridVendor from './components/VendorView';
import GridSku from './components/SkuView';
import GridWarehouse from './components/WarehouseView';
import GridPackaging from './components/PackagingView';
import { GridPsku } from './components/PskuView';
import LastMileGrid from './components/LastMileView';
import { Payments } from './components/PaymentsView';
import { ProductTag } from './components/ProductTagview';
import {ConfigTable} from './components/ConfigsNew'
import { Notifications } from './components/Notifications';
import { FormX } from './components/MenuX'

function App() {
  return (
    <div className="App">
      <Router>
        <Sidebar />
        <div style={{ marginLeft: '280px', width: '80vw' }}>
          <Routes>
            <Route path="/" element={<FormX />} />
            <Route path="/calculator" element={<FormX />} />
            <Route path="/vendor" element={<GridVendor />} />
            <Route path="/sku" element={<GridSku />} />
            <Route path="/psku" element={<GridPsku />} />
            <Route path="/warehouse" element={<GridWarehouse />} />
            <Route path="/packaging" element={<GridPackaging />} />
            <Route path="/producttag" element={<ProductTag />} />
            <Route path="/configs" element={<ConfigTable />} />
            <Route path="/lastmile" element={<LastMileGrid />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/notifications" element={<Notifications />} />

          </Routes>
        </div>
      </Router>
    </div >

  );
}

export default App;
