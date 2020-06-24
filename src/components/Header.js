import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import catalog from '../img/catalog.svg'
import logo from '../img/logo.svg'
import search from '../img/search.svg'
import menu from '../img/menu.svg'
import { css } from '../context'
import '../css/header.css'


const Header = () => {
  const context = useContext(css);
  // const { white, red } = context.colors;
  // const { text, header } = context.fonts;

  return (
    <header>
      <Link to="/"><img src={logo} id="logo" alt="logo" /></Link>
      <div id="catalog_bar">
        <img src={catalog} alt="catalog" />
        <span className="noselect">Каталог таваров</span>
      </div>
      <div style={{ flex: 1 }} ></div>
      <img src={search} alt="search" id="search_icon" />
      <img src={menu} alt="menu" id="menu_icon" />
    </header>
  )
}

export default Header
