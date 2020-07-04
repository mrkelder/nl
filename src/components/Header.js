import React, { useContext, Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GreyBG from './GreyBG'
import CloseBtn from './CloseBtn'
import CallBack from './CallBack'
import Input from './Input'

import catalogIcon from '../img/catalog.svg'
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
import cross_red from '../img/crossRed.svg'

import { info } from '../context'
import '../css/header.css'
import axios from 'axios'


const Header = () => {
  const infoContext = useContext(info);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isCatalogOpen, setCatalogOpen] = useState(false);
  const [isLangOpen, setLangOpen] = useState(false);
  const [isCallBackOpen, setCallBackOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCatalogUploaded, setCatalogUploaded] = useState(false);
  const [catalogHasProblem, setCatalogHasProblem] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [catalog, setCatalog] = useState([]);
  const [subItems, setSubItems] = useState([]);
  const [subItemsName, setSubItemsName] = useState('none');
  const [subItemsLeft, setSubItemsLeft] = useState('95vw');
  const { lang, changeLang } = infoContext;

  const links = [{ name: { ua: 'На головну', ru: 'На главную' }, img: house, link: '/' }, { name: { ua: 'Порівняння товарів', ru: 'Сравнение товаров' }, img: scales, link: '/' }, { name: { ua: 'Обране', ru: 'Избранное' }, img: favorite, link: '/' }, { name: { ua: 'Кошик', ru: 'Карзина' }, img: bin, link: '/' },];
  const grey_links = [{ name: { ua: 'Доставка та оплата', ru: 'Доставка и оплата' }, link: '/' }, { name: { ua: 'Гарантія', ru: 'Гарантия' }, link: '/' }, { name: { ua: 'Акції', ru: 'Акции' }, link: '/' }, { name: { ua: 'Магазини', ru: 'Магазины' }, link: '/' }];


  const getCatalog = () => {
    setCatalogUploaded(false);
    setCatalogHasProblem(false);
    axios.get('http://localhost:8080/getCatalog')
      .then(info => {
        setCatalog(info.data);
      })
      .catch(err => {
        setCatalogHasProblem(true);
        console.error(err.message);
      })
      .finally(() => {
        setCatalogUploaded(true);
      });
  }

  useEffect(getCatalog, []);

  const openCallBack = () => {
    setMenuOpen(false);
    setCallBackOpen(true);
  };

  const openMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const openCatalog = () => {
    setCatalogOpen(!isCatalogOpen);
  };

  const changeSearchText = e => {
    setSearchText(e);
  };

  const openSubItems = e => {
    const id = e.target.getAttribute('data-id');
    const currentSubItems = catalog[catalog.findIndex(i => id === i._id)];
    setSubItems(currentSubItems.items);
    setSubItemsName(currentSubItems.name);
    setSubItemsLeft('0vw');
  };

  const closeSubItems = () => {
    setSubItemsLeft('95vw');
  };

  const chooseItem = () => {
    openCatalog();
    closeSubItems();
  };

  const openSearch = e => {
    if (isSearchOpen) {
      if (e.target.getAttribute('class') === 'greyBG')
        setSearchOpen(false);
    }
    else {
      setSearchOpen(true);
    }
  };

  const SearchIcon = props => <img src={search} alt="search" className="search_icon" onClick={props.click} />;
  const CleanSearch = () => <img src={cross_red} alt="clean_search" className="search_clean" onClick={() => { setSearchText(''); }} />;

  return (
    <Fragment>
      <header>
        <Link to="/"><img src={logo} id="logo" alt="logo" /></Link>
        <div id="catalog_bar" onClick={openCatalog}>
          <img src={catalogIcon} alt="catalog" />
          <span className="noselect">{lang === 'ua' ? 'Каталог товарів' : 'Каталог товаров'}</span>
        </div>
        <div style={{ flex: 1 }} />
        <SearchIcon click={openSearch} />
        <img src={menu} alt="menu" id="menu_icon" onClick={openMenu} />
      </header>
      {isSearchOpen &&
        <GreyBG click={openSearch}>
          <div id="search">
            <Input
              placeholder={lang === 'ua' ? 'Введіть свій запит' : 'Введите свой запрос'}
              value={searchText}
              input={changeSearchText}
              color="transparent"
            />
            <CleanSearch />
            <div className="divider" />
            <SearchIcon />
          </div>
        </GreyBG>
      }
      {isCatalogOpen &&
        <GreyBG>
          <div id="catalog">
            <section id="catalog_header">
              <CloseBtn theme={1} click={openCatalog} />
              <h3>{lang === 'ua' ? 'Каталог товарiв' : 'Каталог товаров'}</h3>
            </section>
            <section id="catalog_items">
              {!isCatalogUploaded &&
                <h3>Загрузка...</h3>
              }
              {(catalogHasProblem && isCatalogUploaded) &&
                <div>
                  <h3>{lang === 'ua' ? 'Вибачте, ми не змогли завантажити каталог' : 'Простите , мы не смогли загрузить каталог'}</h3>
                  <button onClick={getCatalog}>{lang === 'ua' ? 'Спробувати знову' : 'Побробовать снова'}</button>
                </div>
              }
              {(catalog.length === 0 && isCatalogUploaded && !catalogHasProblem) &&
                <h3>{lang === 'ua' ? 'Каталог поки порожній' : 'Каталог пока пуст'}</h3>
              }
              {catalog.map(i => (
                <div className="catalog_item" key={i._id} data-id={i._id} onClick={openSubItems}>
                  <img src={`http://localhost:8080/${i.img}`} alt="catalog_item" className="itemImg" data-id={i._id} />
                  <span data-id={i._id}>{i.name[lang]}</span>
                  <img src={arrow_sign} alt="arrow_sign" className="arrow" data-id={i._id} />
                </div>
              ))
              }
            </section>
            <div id="sub_items" style={{
              left: subItemsLeft
            }}>
              <section id="catalog_header">
                <CloseBtn theme={1} click={closeSubItems} />
                <h3>{subItemsName[lang]}</h3>
              </section>
              <section id="sub_items_block">
                {
                  subItems.map((element, index) => (
                    <Link key={`item_${index}`} to={element.link} className="sub_item" onClick={chooseItem}>
                      {element.name[lang]}
                    </Link>
                  ))
                }
              </section>
            </div>
          </div>
        </GreyBG>
      }
      {
        isMenuOpen &&
        <GreyBG>
          <nav id="menu">
            <section id="sec1">
              <div id="user">
                <img src={no_account_logo} alt="user_logo" />
                <span>{lang === 'ua' ? 'Мій обліковий запис' : 'Моя учетная запись'}</span>
              </div>
              <CloseBtn click={openMenu} />
            </section>
            <hr />
            <section id="sec2">
              <div id="location">
                <img src={geo_sign} alt="geo_sign" />
                <span>{lang === 'ua' ? 'Київ' : 'Киев'}</span>
              </div>
              <div className="divider" />
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
            <section id="sec5" onClick={openCallBack}>
              <img src={helper} alt="callcenter" />
              <span className="phone_number">0 800 40 40 40</span>
              <div style={{ flex: 1 }} />
              <span className="callback">{lang === 'ua' ? 'Мы передзвоним' : 'Мы перезвоним'}</span>
            </section>
          </nav>
        </GreyBG>
      }
      {isCallBackOpen && <CallBack close={setCallBackOpen} input={{ placeholder: '+38(0XX) XXX-XX-XX', text: "Номер телефона" }} />}
    </Fragment >
  );
}

export default Header