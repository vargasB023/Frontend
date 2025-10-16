import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaExclamationTriangle, FaUserCheck } from 'react-icons/fa';
import './css/barraLateral.css';

const BarraLateral = () => {
  const links = [
    { ruta: '/dashEntrenador', label: 'Inicio', icono: <FaHome /> },

  ];

  return (
    <nav className="sidebar">
      <ul className="navList">
        {links.map((link) => (
          <li key={link.ruta}>
            <NavLink
              to={link.ruta}
              className={({ isActive }) =>
                isActive ? 'navItem activo' : 'navItem'
              }
            >
              <span className="navIcon">{link.icono}</span>
              <span className="navLabel">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BarraLateral;
