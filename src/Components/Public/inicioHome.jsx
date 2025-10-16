import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import './css/inicioHome.css'
import gadderNuevo from "./img/gadderBlanco.png";

export default function Iniciopagina() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="encabezado-principal">
      <div className="contenedor-logo">
        <Link to='/'>
           <img src={gadderNuevo} alt="GADDER Logo" className="img-logo" />
        </Link>
      </div> 
    </header>
  );
}