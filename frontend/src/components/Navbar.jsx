import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { customer, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="nav-brand">
        <Link to="/">⚡ QuickBite</Link>
      </div>
      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>
          Home
        </NavLink>
        <NavLink to="/restaurants" className={({ isActive }) => (isActive ? 'active-link' : '')}>
          Restaurants
        </NavLink>
        <NavLink to="/order" className={({ isActive }) => (isActive ? 'active-link' : '')}>
          Order {isAuthenticated ? '' : '🔒'}
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active-link' : '')}>
          Admin (Lazy)
        </NavLink>
      </nav>
      <div className="nav-user">
        {isAuthenticated ? (
          <div className="user-logged">
            <span>👤 {customer?.name || customer?.email}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        ) : (
          <span className="user-guest">Guest</span>
        )}
      </div>
    </header>
  );
};

export default Navbar;
