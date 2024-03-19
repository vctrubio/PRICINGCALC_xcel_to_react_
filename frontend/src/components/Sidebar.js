import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';
import axios from 'axios';


function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 600);

  const handleSave =() => {
    async function save() {
      try {
        const response = await axios.get(`http://localhost:8000/save`);
      } catch (error) {
        console.error('There was a BIGFAT SAVE error!', error);
      }
    }
    save();
  };

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} >
      <Link to="/calculator"><i className="fas fa-home"></i> Calculator</Link>
      <Link to="/psku"><i className="bi bi-box-seam"></i> Master </Link>
      <Link to="/vendor"><i className="fas fa-table"></i> Vendor</Link>
      <Link to="/sku"><i className="fas fa-table"></i> SKU</Link>
      <Link to="/warehouse"><i className="fas fa-table"></i> Warehouse</Link>
      <Link to="/packaging"><i className="fas fa-table"></i> Packaging</Link>
      <Link to="/lastmile"><i className="fas fa-table"></i> Last Mile</Link>
      <Link to="/payments"><i className="fas fa-table"></i> Payments</Link>
      <Link to="/configs"><i className="bi bi-book"></i> Config</Link>
      <Button className='btn btn-secondary' onClick={handleSave}>Safe</Button>

      {/* <Link to="/notifications"><i className="bi bi-mailbox2"></i> Notifications</Link> */}
      {/* <Link to="/producttag"><i className="bi bi-book"></i> Configs2</Link> */}

      {/* Control Bar Notifications. Where errors show.
        SKU with no vendor goes to defualt
        Coutry with no zone to default

        Control Pannel Schema of relationship

        bi bi-mailbox2-flag
      */}
    </div>
  );
}

export default Sidebar;
