import React, { useContext, Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import GreyBG from './GreyBG'
import catalog from '../img/catalog.svg'
import logo from '../img/logo.svg'
import search from '../img/search.svg'
import menu from '../img/menu.svg'
import no_account_logo from '../img/user.png'
import bin from '../img/bin.png'
import house from '../img/house.png'
import favorite from '../img/favorite.png'
import scales from '../img/scales.png'
import geo_sign from '../img/location.png'
import arrow_sign from '../img/arrow.png'
import helper from '../img/helper.png'
import { info } from '../context'
import '../css/header.css'


const Header = () => {
  const infoContext = useContext(info);
  const [isMenuOpen, setMenuOpen] = useState(true);
  const [isLangOpen, setLangOpen] = useState(false);
  const { lang, changeLang } = infoContext;

  const links = [{ name: { ua: 'На головну', ru: 'На главную' }, img: house, link: '/' }, { name: { ua: 'Порівняння товарів', ru: 'Сравнение товаров' }, img: scales, link: '/' }, { name: { ua: 'Обране', ru: 'Избранное' }, img: favorite, link: '/' }, { name: { ua: 'Кошик', ru: 'Карзина' }, img: bin, link: '/' },];
  const grey_links = [{ name: { ua: 'Доставка та оплата', ru: 'Доставка и оплата' }, link: '/' }, { name: { ua: 'Гарантія', ru: 'Гарантия' }, link: '/' }, { name: { ua: 'Акції', ru: 'Акции' }, link: '/' }, { name: { ua: 'Магазини', ru: 'Магазины' }, link: '/' }];


  const openMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <Fragment>
      <header>
        <Link to="/"><img src={logo} id="logo" alt="logo" /></Link>
        <div id="catalog_bar">
          <img src={catalog} alt="catalog" />
          <span className="noselect">{lang === 'ua' ? 'Каталог товарів' : 'Каталог товаров'}</span>
        </div>
        <div style={{ flex: 1 }} />
        <img src={search} alt="search" id="search_icon" />
        <img src={menu} alt="menu" id="menu_icon" onClick={openMenu} />
      </header>
      {isMenuOpen &&
        <GreyBG>
          <nav id="menu">
            <section id="sec1">
              <div id="user">
                <img src={no_account_logo} alt="user_logo" />
                <span>{lang === 'ua' ? 'Мій обліковий запис' : 'Моя учетная запись'}</span>
              </div>
              <button onClick={openMenu} className="closeBtn" />
            </section>
            <hr />
            <section id="sec2">
              <div id="location">
                <img src={geo_sign} alt="geo_sign" />
                <span>{lang === 'ua' ? 'Київ' : 'Киев'}</span>
              </div>
              <div id="divider" />
              <div id="lang" onClick={() => setLangOpen(!isLangOpen)}>
                <span>{lang === 'ua' ? 'UA' : 'RU'}</span>
                <img src={arrow_sign} alt="arrow_sign" />
                {isLangOpen &&
                  <div id="langWindow" onClick={changeLang}>
                    <span>{lang === 'ua' ? 'RU' : 'UA'}</span>
                  </div>
                }
              </div>
            </section>
            <hr />
            <section id="sec3">
              {
                links.map((element, index) =>
                  <Link key={`link_${index}`} to={element.link} onClick={openMenu}>
                    <div className="menu_link">
                      <img src={element.img} alt="menu_link" />
                      <span>{element.name[lang]}</span>
                    </div>
                  </Link>)
              }
            </section>
            <section id="sec4">
              {
                grey_links.map((element, index) =>
                  <Link key={index} to={element.link} onClick={openMenu}>
                    {element.name[lang]}
                  </Link>)
              }
            </section>
            <section id="sec5">
              <img src={helper} alt="callcenter" />
              <span className="phone_number">0 800 40 40 40</span>
              <div style={{ flex: 1 }} />
              <span className="callback">{lang === 'ua' ? 'Мы передзвоним' : 'Мы перезвоним'}</span>
            </section>
          </nav>
        </GreyBG>
      }
    </Fragment>
  );
}

export default Header