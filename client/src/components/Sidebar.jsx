import { NavLink } from 'react-router-dom';

function Sidebar() {
return ( <aside className="sidebar">


  <div className="sidebar-logo">
    <div className="logo-icon">C</div>
    <h2>CRM<span>Pro</span></h2>
  </div>

  <p className="menu-heading">MAIN MENU</p>

  <nav className="sidebar-menu">

    <NavLink to="/" end className={({ isActive }) =>
      isActive ? 'menu-item active' : 'menu-item'
    }>
      <span className="menu-icon">▦</span>
      <span>Dashboard</span>
    </NavLink>

    <NavLink to="/leads" className={({ isActive }) =>
      isActive ? 'menu-item active' : 'menu-item'
    }>
      <span className="menu-icon">♙</span>
      <span>Leads</span>
    </NavLink>

    <NavLink to="/customers" className={({ isActive }) =>
      isActive ? 'menu-item active' : 'menu-item'
    }>
      <span className="menu-icon">♧</span>
      <span>Customers</span>
    </NavLink>

    <NavLink to="/sales-pipeline" className={({ isActive }) =>
      isActive ? 'menu-item active' : 'menu-item'
    }>
      <span className="menu-icon">▤</span>
      <span>Sales Pipeline</span>
    </NavLink>

    <NavLink to="/activities" className={({ isActive }) =>
      isActive ? 'menu-item active' : 'menu-item'
    }>
      <span className="menu-icon">◷</span>
      <span>Activities</span>
    </NavLink>

    <NavLink to="/reports" className={({ isActive }) =>
      isActive ? 'menu-item active' : 'menu-item'
    }>
      <span className="menu-icon">▥</span>
      <span>Reports</span>
    </NavLink>

  </nav>

  <div className="sidebar-bottom">

    <a href="#" className="menu-item">
      <span className="menu-icon">⚙</span>
      <span>Settings</span>
    </a>

    <a href="#" className="menu-item logout">
      <span className="menu-icon">↪</span>
      <span>Logout</span>
    </a>

  </div>

</aside>


);
}

export default Sidebar;
