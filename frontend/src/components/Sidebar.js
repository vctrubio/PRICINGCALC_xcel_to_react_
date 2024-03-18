import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 600);

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
      <Link to="/notifications"><i className="bi bi-mailbox2"></i> Notifications</Link>
      <Link to="/configs"><i className="bi bi-book"></i> Config</Link>

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
