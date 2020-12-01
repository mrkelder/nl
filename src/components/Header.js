import React, { useContext, Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GreyBG from './GreyBG'
import CloseBtn from './CloseBtn'
import CallBack from './CallBack'
import Input from './Input'

import { info, css, img } from '../context'
import '../css/header.css'
import axios from 'axios'


const Header = () => {
  const infoContext = useContext(info);
  const cssContext = useContext(css);
  const imgContext = useContext(img);
  const { domain, allInfoAboutUser } = infoContext;

  const [chosenItem, setChosenItem] = useState(null);
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
  const [receivedSearchItems, setReceivedSearchItems] = useState([]);
  const [searching, setSearching] = useState(false);
  const [subItemsName, setSubItemsName] = useState('none');
  const [subItemsLeft, setSubItemsLeft] = useState('95vw');
  const { lang, changeLang, resolution } = infoContext;

  const { catalogIcon, logo, arrow_sign, arrow_sign_white, helper, search, menu, no_account_logo, no_account_logo_white, bin, house, favorite, scales, geo_sign, geo_sign_white } = imgContext;
  const links = [{ name: { ua: 'На головну', ru: 'На главную' }, img: house, link: '/' }, { name: { ua: 'Порівняння товарів', ru: 'Сравнение товаров' }, img: scales, link: '/' }, { name: { ua: 'Обране', ru: 'Избранное' }, img: favorite, link: '/' }, { name: { ua: 'Кошик', ru: 'Корзина' }, img: bin, link: '/bin' },];
  const grey_links = [{ name: { ua: 'Доставка та оплата', ru: 'Доставка и оплата' }, link: '/' }, { name: { ua: 'Гарантія', ru: 'Гарантия' }, link: '/' }, { name: { ua: 'Акції', ru: 'Акции' }, link: '/' }, { name: { ua: 'Магазини', ru: 'Магазины' }, link: '/' }];
  const { white, light_grey } = cssContext.colors;

  const getCatalog = () => {
    // Receives the catalog of the categries
    setCatalogUploaded(false);
    setCatalogHasProblem(false);
    axios.get(`http://${domain}/getCatalog`)
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

  useEffect(() => {
    // Renders subItems of the first category of the catalog (when you first opens it)
    if (resolution >= 1024 && catalog.length !== 0) {
      setSubItems(catalog[0].items);
      setSubItemsName(catalog[0].name);
    }
  }, [catalog, resolution]);

  useEffect(() => {
    // Makes fiest element of the catalog picked out (when you first opens it)
    if (resolution >= 1024 && chosenItem === null && isCatalogOpen) {
      document.getElementsByClassName('catalog_item')[0].style.backgroundColor = light_grey;
    }
    else if (resolution >= 1024 && chosenItem !== null && isCatalogOpen) {
      document.getElementById(chosenItem).style.backgroundColor = light_grey;
    }
  }, [isCatalogOpen, chosenItem, light_grey, resolution]);

  const openCallBack = () => {
    // Opens call me back window
    setMenuOpen(false);
    setCallBackOpen(true);
  };

  const openMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const openCatalog = () => {
    setCatalogOpen(!isCatalogOpen);
  };

  const clickSearchedLink = () => {
    setSearchOpen(false);
    setSearching(false);
    setSearchText('');
    setReceivedSearchItems([]);
  };

  const changeSearchText = async e => {
    // Changes search's value
    setSearchText(e);
    const { data } = await axios.get(`http://${domain}/searchItem`, { params: { text: e } });
    setReceivedSearchItems(data);
    if ([...e].length > 0) setSearching(true);
  };

  const openSubItems = e => {
    // Opens subItems of the picked out category
    const id = e.target.getAttribute('data-id');
    const currentSubItems = catalog[catalog.findIndex(i => id === i._id)];
    setSubItems(currentSubItems.items);
    setSubItemsName(currentSubItems.name);
    setSubItemsLeft('0vw');
    if (resolution >= 1024) {
      setChosenItem(`catalog_item_${id}`);
      for (let i of document.getElementsByClassName('catalog_item')) {
        i.style.backgroundColor = white;
      }
      document.getElementById(`catalog_item_${id}`).style.backgroundColor = light_grey;
    }
  };

  const closeSubItems = () => {
    // Slides subItems to the right (work only in mobile devices)
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
    setSearching(!searching);
  };

  const SearchIcon = props => <img src={search} alt="search" className="search_icon" onClick={props.click} />;
  const MenuIcon = props => <img alt="menu_icon" src={props.img} className="menu_icon" />;

  return (
    <Fragment>
      <header>
        {resolution < 1024 ?
          <Fragment>
            <Link to="/"><img src={logo} id="logo" alt="logo" /></Link>
            <div id="catalog_bar" onClick={openCatalog}>
              <img src={catalogIcon} alt="catalog" />
              <span className="noselect">{lang === 'ua' ? 'Каталог товарів' : 'Каталог товаров'}</span>
            </div>
            <div style={{ flex: 1 }} />
            <SearchIcon click={openSearch} />
            <img src={menu} alt="menu" id="menu_icon" onClick={openMenu} />
          </Fragment>
          :
          <Fragment>
            <section id="sec1_h">
              <div id="sec1_h_wrapper">
                <div>
                  {
                    grey_links.map((element, index) =>
                      <Link key={index} to={element.link}>
                        {element.name[lang]}
                      </Link>)
                  }
                </div>
                <div>
                  <div id="tel_h" onClick={openCallBack}>
                    <span className="noselect">0 800 40 40 40</span>
                    <img src={arrow_sign_white} alt="arrow" className="arrow" />
                    <div className="sub_window">{lang === 'ua' ? 'Мы передзвоним' : 'Мы перезвоним'}</div>
                  </div>
                  <div id="city_h">
                    <span className="noselect">{lang === 'ua' ? 'Київ' : 'Киев'}</span>
                    <img src={geo_sign_white} alt="location" className="arrow" />
                  </div>
                  <div id="lang_h" onClick={changeLang}>
                    <span className="noselect">{lang === 'ua' ? 'Укр' : 'Рус'}</span>
                    <img src={arrow_sign_white} alt="arrow" className="arrow" />
                    <div className="sub_window">{lang === 'ua' ? 'Рус' : 'Укр'}</div>
                  </div>
                  <div id="user_h">
                    <img src={no_account_logo_white} alt="user_logo" className="arrow" />
                    <Link to="/account" >
                      <span className="noselect">{lang === 'ua' ? 'Мій обліковий запис' : 'Моя учетная запись'}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
            <section id="sec2_h">
              <div id="sec2_h_wrapper">
                <Link to="/"><img src={logo} id="logo" alt="logo" /></Link>
                <div className="catalog">
                  <p className="noselect" onClick={openCatalog}>{lang === 'ua' ? 'Каталог товарів' : 'Каталог товаров'}</p>
                  {isCatalogOpen &&
                    <div id="catalog">
                      <div id="catalog_menu">
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
                          <div className="catalog_item" id={`catalog_item_${i._id}`} key={i._id} data-id={i._id} onClick={openSubItems}>
                            <img src={`http://${domain}/${i.img}`} alt="catalog_item" className="itemImg" data-id={i._id} />
                            <span data-id={i._id}>{i.name[lang]}</span>
                            <img src={arrow_sign} alt="arrow_sign" className="arrow" data-id={i._id} />
                          </div>
                        ))
                        }
                      </div>
                      <div id="catalog_items">
                        {
                          subItems.map((element, index) => (
                            <div key={index} className="items_wrapper">
                              <Link onClick={openCatalog} key={`item_${index}`} to={`/shop${element.link}`} className="sub_item">
                                <h3>{element.name[lang]}</h3>
                              </Link>
                              {element.companies.map(i => (
                                <Link onClick={openCatalog} key={i._id} to={`/shop${element.link}?company=${i._id}`}>
                                  <span>{i.name}</span>
                                </Link>
                              ))}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  }
                </div>
                <div id="searchInpAndResult">
                  <Input
                    placeholder={lang === 'ua' ? 'Введіть свій запит' : 'Введите свой запрос'}
                    value={searchText}
                    input={changeSearchText}
                    addForCleaning={() => { setSearching(false) }}
                    isSearch
                  />
                  {receivedSearchItems.length > 0 &&
                    <div id="foundItems">
                      {
                        receivedSearchItems.map(({ _id, name, themes }) =>
                          <Link to={`/item/${_id}`} key={`item_${_id}`} onClick={clickSearchedLink}>
                            <div className="searchingItem">
                              <div style={{ backgroundImage: `url('http://${domain}/${themes[0].main_photo}')` }} />
                              <p>{name}</p>
                            </div>
                          </Link>)
                      }
                    </div>
                  }
                </div>
                <MenuIcon img={scales} />
                <MenuIcon img={favorite} />
                <Link to="/bin">
                  <MenuIcon img={bin} />
                </Link>
              </div>
            </section>
          </Fragment>
        }
      </header>

      {isSearchOpen &&
        <GreyBG click={openSearch}>
          <div id="search">
            <Input
              placeholder={lang === 'ua' ? 'Введіть свій запит' : 'Введите свой запрос'}
              value={searchText}
              input={changeSearchText}
              color="transparent"
              isSearch
              addForCleaning={() => { setSearching(false) }}
            />
          </div>
          <div id="foundItems">
            {
              receivedSearchItems.map(({ _id, name, themes }) =>
                <Link to={`/item/${_id}`} key={`item_${_id}`} onClick={clickSearchedLink}>
                  <div className="searchingItem">
                    <div style={{ backgroundImage: `url('http://${domain}/${themes[0].main_photo}')` }} />
                    <p>{name}</p>
                  </div>
                </Link>)
            }
            {receivedSearchItems.length === 0 && searching &&
              <h3 id="nothing_found">Ничего не найдено</h3>
            }
          </div>
        </GreyBG>
      }
      {isCatalogOpen && resolution < 1024 &&
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
                  <img src={`http://${domain}/${i.img}`} alt="catalog_item" className="itemImg" data-id={i._id} />
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
                    <Link key={`item_${index}`} to={`/shop${element.link}`} className="sub_item" onClick={chooseItem}>
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
                <img src={allInfoAboutUser.photo !== 'default' ? `http://${domain}/${allInfoAboutUser.photo}` : no_account_logo} alt="user_logo" />
                <Link to="/account" onClick={openMenu}>
                  <span>{lang === 'ua' ? 'Мій обліковий запис' : 'Моя учетная запись'}</span>
                </Link>
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