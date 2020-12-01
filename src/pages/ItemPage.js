import React, { createRef, Fragment, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import RedButton from '../components/RedButton'
import GreyBG from '../components/GreyBG'
import Input from '../components/Input'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import plus from '../img/plus.png'
import minus from '../img/minus.png'
import like from '../img/like.svg'
import dislike from '../img/dislike.svg'

import { info, img, css } from '../context'
import '../css/itemPage.css'

const Review = ({ name, rating, text, date, advantages, disadvantages, likes, dislikes }) => {

  const { lang } = useContext(info);
  const { star_active } = useContext(img);

  function giveMonth(date) {
    // Convertes date into a proper text
    let month;
    const dateObject = new Date(date);
    switch (dateObject.getMonth()) {
      case 0: month = lang === 'ua' ? 'Січеня' : 'Января'; break;
      case 1: month = lang === 'ua' ? 'Лютого' : 'Февраля'; break;
      case 2: month = lang === 'ua' ? 'Березеня' : 'Марта'; break;
      case 3: month = lang === 'ua' ? 'Квітеня' : 'Апреля'; break;
      case 4: month = lang === 'ua' ? 'Травеня' : 'Мая'; break;
      case 5: month = lang === 'ua' ? 'Червеня' : 'Июня'; break;
      case 6: month = lang === 'ua' ? 'Липеня' : 'Июля'; break;
      case 7: month = lang === 'ua' ? 'Серпеня' : 'Августа'; break;
      case 8: month = lang === 'ua' ? 'Вересеня' : 'Сентября'; break;
      case 9: month = lang === 'ua' ? 'Жовтеня' : 'Октября'; break;
      case 10: month = lang === 'ua' ? 'Листопада' : 'Ноября'; break;
      case 11: month = lang === 'ua' ? 'Груденя' : 'Декобря'; break;
      default: month = lang === 'ua' ? 'Січеня' : 'Января'; break;
    }
    return `${dateObject.getDate()} ${month} ${dateObject.getFullYear()}`;
  }

  return <div className="review">
    <div className="r_heading">
      <div className="author">
        <p className="a_name">{name}</p>
        <p className="a_date">{giveMonth(date)}</p>
      </div>
      <div className="comment_info">
        <img src={star_active} alt="star" />
        <p>{rating}</p>
      </div>
    </div>
    <div className="r_comment">
      <p>{text}</p>
      <h3>{lang === 'ua' ? 'Переваги' : 'Достоинтсва'}</h3>
      <p>{advantages}</p>
      <h3>{lang === 'ua' ? 'Недоліки' : 'Недостатки'}</h3>
      <p>{disadvantages}</p>
    </div>
    <div className="r_judging">
      <button>
        <img src={like} alt="like" />
        <span>{likes}</span>
      </button>
      <button>
        <img src={dislike} alt="dislike" />
        <span>{dislikes}</span>
      </button>
    </div>
  </div>;
}

const Option = ({ name, value }) =>
  // A property of an item
  <div className="item_property">
    <span>{name}</span>
    <span>{value}</span>
  </div>;

const Color = ({ color, click, pickedColorTheme, red, grey, item }) => <div onClick={click} style={color === item.themes[pickedColorTheme].color ? { border: `1px solid ${red}` } : { border: `1px solid ${grey}` }} data-color={color} className="color_picker">
  <div data-color={color} style={{ backgroundColor: color }} className="color_picker_circle" />
</div>;

const ItemFadeButton = ({ text, children, checked, id, globalSetter }) => {
  const [isOpened, setOpened] = useState(false);
  const buttonRef = createRef();

  useEffect(() => {
    if (checked !== undefined) setOpened(checked);
  }, [checked]);

  const clickEvent = ({ target }) => {
    const button = buttonRef.current;
    const HTMLElements = button.children;
    const arrayOfElements = [...HTMLElements];

    if (arrayOfElements.includes(target) || target === button) {
      // If user clicks nothing but the button 
      if (typeof globalSetter === 'function') globalSetter(!checked);
      else setOpened(!isOpened);
    }
  };

  return <div className="itemFadeButton" id={id ? id : null} onClick={clickEvent}>
    <div className="show_part" ref={buttonRef}>
      <p>{text}</p>
      <button style={isOpened ? { backgroundImage: `url('${minus}')` } : { backgroundImage: `url('${plus}')` }} />
    </div>
    {isOpened &&
      <div className="hideable_part">
        {children}
      </div>
    }
  </div>
};

function ItemPage({ match: { params: { itemId } } }) {
  const { star, star_active, favorite, scales, cross, arrow_sign } = useContext(img);
  const { lang, domain, user, allInfoAboutUser, resolution, addItemToBin, bin } = useContext(info);
  const { red, grey } = useContext(css).colors;
  const [currentTheme, setCurrentTheme] = useState(0); // index of the current color theme
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [item, setItem] = useState(null); // object of the current item
  const [cities, setCities] = useState([]); // all available cities
  const [areAllPropertiesOpened, setAllPropertiesOpened] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isCommentMenuOpen, setCommentMenuOpen] = useState(false); // Is comment menu opened
  const [quantityOfPickedStars, setQuantityOfStarts] = useState(5); // Amount of stars for the comment
  const [commentText, setCommentText] = useState('');
  const [commentAdv, setCommentAdv] = useState('');
  const [commentDisadv, setCommentDisadv] = useState('');

  const history = useHistory();

  useEffect(() => {
    // Sends this item to user's database as a lately seen product
    if (user && item) {
      async function sendInfo() {
        await axios.post(`http://${domain}/getLatelySeenProduct`, { productId: item._id, email: user.email, password: user.pass });
      }
      sendInfo();
    }
  }, [domain, user, item]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(`http://${domain}/getShops`);
      setCities(data);
    }
    fetchData();
  }, [domain]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(`http://${domain}/getItem`, { params: { id: itemId } });
      setItem(data);
      setCurrentPhoto(data.themes[0].main_photo);
      window.scroll({ top: 0 });
    }
    fetchData();
  }, [domain, itemId]);

  function openCommentMenu() {
    // Opens comment menu
    setCommentMenuOpen(!isCommentMenuOpen);
  }

  function pickCommentRating({ target }) {
    // Choosing rating for user's comment
    const amountOfStars = Number(target.getAttribute('data-star'));
    setQuantityOfStarts(amountOfStars);
  }

  function changeMainPhoto({ target }) {
    // Changes main photo when a user clicks the photo list
    setCurrentPhoto(target.getAttribute('data-photo'));
  }

  function openAllProperties() {
    setAllPropertiesOpened(true);
    window.scroll({
      top: document.getElementById('allProperties').offsetTop,
      left: 0,
      behavior: 'smooth'
    });
  }

  function changeTheme({ target }) {
    // Changes a color theme
    const color = target.getAttribute('data-color');
    const index = item.themes.findIndex(i => i.color === color);
    setCurrentTheme(index);
    setCurrentPhoto(item.themes[index].main_photo);
  }

  function buyItem() {
    if (user && allInfoAboutUser) {
      addItemToBin(item, currentTheme);
    }
    else {
      history.push('/account');
    }
  }

  function changeComment(text) {
    setCommentText(text);
  }

  function changeAdv(text) {
    setCommentAdv(text);
  }

  function changeDisadv(text) {
    setCommentDisadv(text);
  }

  async function sendComment() {
    if (allInfoAboutUser !== null && user !== null) {
      if ([...commentText].length > 0 && [...commentAdv].length > 0 && [...commentDisadv].length > 0) {
        const { data } = await axios.post(`http://${domain}/sendComment`, { allInfoAboutUser, text: commentText, adv: commentAdv, disadv: commentDisadv, rating: quantityOfPickedStars, productId: item._id, date: new Date().toISOString(), theme: currentTheme });
        if (data === 'Okay') {
          const newItem = item;
          newItem.reviews.unshift({ name: allInfoAboutUser.name, text: commentText, likes: 0, dislikes: 0, advantages: commentAdv, disadvantages: commentDisadv, rating: quantityOfPickedStars, productId: item._id, date: new Date().toISOString() });
          setItem(newItem);
          setCommentAdv('');
          setCommentDisadv('');
          setCommentText('');
          setQuantityOfStarts(5);
          openCommentMenu();
        }
      }
      else {
        openCommentMenu();
      }
    }
    else {
      history.push('/account');
    }
  }

  return (
    <div id="itemPage">
      { item !== null &&
        <Fragment>
          {isCommentMenuOpen &&
            <GreyBG style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div id="commentMenu">
                <img src={cross} alt="cross" onClick={openCommentMenu} className="crossBtn" />
                <Input text={lang === 'ua' ? 'Коментар' : 'Комментарий'} value={commentText} input={changeComment} />
                <Input text={lang === 'ua' ? 'Переваги' : 'Достоинтсва'} value={commentAdv} input={changeAdv} />
                <Input text={lang === 'ua' ? 'Недоліки' : 'Недостатки'} value={commentDisadv} input={changeDisadv} />
                <div className="star_panel">
                  {
                    [1, 2, 3, 4, 5].map(i => <img key={`star_${i}`} onClick={pickCommentRating} src={quantityOfPickedStars >= i ? star_active : star} alt="star" data-star={i} />)
                  }
                </div>
                <RedButton text={lang === 'ua' ? 'Надіслати' : 'Отправить'} click={sendComment} />
              </div>
            </GreyBG>
          }

          {resolution < 1024 &&
            <Fragment>
              <Link to={`/shop/${item.link}`}>
                <span id="backToTheCatalog">{'< Назад в каталог'}</span>
              </Link>
              <h2>{item.name}</h2>
              <div id="itemStars">
                {
                  new Array(item.themes[currentTheme].rating).fill(null).map((i, index) => <div className="star" key={`star${index}`} style={{ backgroundImage: `url('${star_active}')` }} />)
                }
                {
                  new Array(5 - item.themes[currentTheme].rating).fill(null).map((i, index) => <div className="star" key={`star${index}`} style={{ backgroundImage: `url('${star}')` }} />)
                }
              </div>
              <div id="main_photo" style={{ backgroundImage: `url('http://${domain}/${currentPhoto}')` }} />
              <div id="photo_list">
                <div id="photo_moving_part">
                  {
                    item.themes[currentTheme].photos.map((photo, index) => <div onClick={changeMainPhoto} data-photo={photo} className="photo" key={`${photo}_${index}`} style={{ backgroundImage: `url('http://${domain}/${photo}')` }} />)
                  }
                </div>
              </div>
              <p id="price">{item.themes[currentTheme].price} грн</p>
              {bin.findIndex(binItem => binItem._id === item._id) === -1 ?
                <RedButton click={buyItem} text={lang === 'ua' ? 'Купити' : 'Купить'} />
                :
                <RedButton click={buyItem} customStyle={2} text={lang === 'ua' ? 'Додано в кошик' : 'Добавлено в корзину'} />
              }
              <div id="panel">
                <div id="favorite">
                  <img src={favorite} alt="favorite" />
                  <span>{lang === 'ua' ? 'У обране' : 'В избранное'}</span>
                </div>
                <div id="compare">
                  <img src={scales} alt="compare" />
                  <span>{lang === 'ua' ? 'Порівняти' : 'Сравнить'}</span>
                </div>
              </div>
              <h3 id="colors_picker">{lang === 'ua' ? 'Колір' : 'Цвет'}</h3>
              <div id="colors">
                {
                  item.themes.map(({ color }, index) => <Color item={item} red={red} grey={grey} pickedColorTheme={currentTheme} click={changeTheme} key={`color_${index}`} color={color} />)
                }
              </div>
              <h3 id="main_features">{lang === 'ua' ? 'Ключові особливості' : 'Ключевые особенности'}</h3>
              {
                item.properties.slice(0, 4).map((property, index) => <Option {...property} key={`option_${index}`} />)
              }
              <p id="showAllProperties" onClick={openAllProperties}>{lang === 'ua' ? 'Показати всі характеристики' : 'Показать все характеристики'}</p>
              <h3 id="availble_shops_title">{lang === 'ua' ? 'Магазини де можна забрати товар' : 'Магазины , где можно забрать товар'}</h3>
              {
                item.available_shops.length > 0 ?
                  <Fragment>
                    {
                      // eslint-disable-next-line
                      item.available_shops.map((shopId, index) => {
                        for (let city of cities) {
                          for (let shop of city.shops) {
                            if (shop._id === shopId) return <p className="available_shops" key={`${shopId}_${index}`} >{shop.name} - <b>{city.name[lang]}</b></p>;
                            else return null;
                          }
                        }
                      })
                    }
                  </Fragment>
                  :
                  <p className="available_shops">{lang === 'ua' ? 'Вибачте, але такого товару немає на складі' : 'Простите , но такого товара нет на складе'}</p>
              }
              <div id="listOfProperties">
                <ItemFadeButton text="Характеристики" checked={areAllPropertiesOpened} globalSetter={setAllPropertiesOpened} id="allProperties">
                  {
                    item.properties.map((property, index) => <Option {...property} key={`option_${index}`} />)
                  }
                </ItemFadeButton>
                <ItemFadeButton text={lang === 'ua' ? `Відгуки та питання ${item.reviews.length}` : `Отзывы и вопросы ${item.reviews.length}`} id="reviews">
                  <RedButton click={openCommentMenu} text={lang === 'ua' ? 'Залишити відгук' : 'Оставить отзыв'} />
                  <div className="comments">
                    {item.reviews.length > 0 ?
                      <Fragment>
                        {showAllComments ?
                          <Fragment>
                            {
                              item.reviews.map((review, index) => <Review {...review} key={`review_${index}`} />)
                            }
                            <p id="showAllComments" onClick={() => { setShowAllComments(false) }}>{lang === 'ua' ? 'Приховати частину коментарів' : 'Скрыть часть комментариев'}</p>
                          </Fragment>
                          :
                          <Fragment>
                            {
                              item.reviews.slice(0, 3).map((review, index) => <Review {...review} key={`review_${index}`} />)
                            }
                            <p id="showAllComments" onClick={() => { setShowAllComments(true) }}>{lang === 'ua' ? 'Показати всі коментарі' : 'Показать все комментарии'}</p>
                          </Fragment>
                        }
                      </Fragment>
                      :
                      <h3 id="no_comments">{lang === 'ua' ? 'Коментарів поки що немає. Станете першим?' : 'Отзывов пока нет. Станьте первым!'}</h3>
                    }
                  </div>
                </ItemFadeButton>
              </div>
            </Fragment>
          }
          {resolution >= 1024 &&
            <Fragment>
              <div id="bread_crumbs">
                <Link to="/">
                  <span id="backToTheCatalog">{lang === 'ua' ? 'Головна' : 'Главная'}</span>
                  <img src={arrow_sign} alt="arrow" />
                </Link>
                <Link to={`/shop/${item.link}`}>
                  <span id="backToTheCatalog">Назад в каталог</span>
                  <img src={arrow_sign} alt="arrow" />
                </Link>
                <span>{[...item.name].length > 60 ? `${[...item.name].slice(0, 60).join('')}...` : item.name}</span>
              </div>
              <h1>{item.name}</h1>
              <div id="itemStars">
                {
                  new Array(item.themes[currentTheme].rating).fill(null).map((i, index) => <div className="star" key={`star${index}`} style={{ backgroundImage: `url('${star_active}')` }} />)
                }
                {
                  new Array(5 - item.themes[currentTheme].rating).fill(null).map((i, index) => <div className="star" key={`star${index}`} style={{ backgroundImage: `url('${star}')` }} />)
                }
              </div>
              <section id="info_section">
                <div id="photos">
                  <img src={`http://${domain}/${currentPhoto}`} alt="main_photo" id="main_photo" />
                  <Swiper
                    id="photo_list"
                    slidesPerView={3}>
                    {
                      item.themes[currentTheme].photos.map((photo, index) =>
                        <SwiperSlide key={`${photo}_${index}`}>
                          <div onClick={changeMainPhoto} data-photo={photo} className="photo" style={{ backgroundImage: `url('http://${domain}/${photo}')` }} />
                        </SwiperSlide>)
                    }
                  </Swiper>
                </div>
                <div id="info_sec">
                  <h2>{item.themes[currentTheme].price} грн</h2>
                  {bin.findIndex(binItem => binItem._id === item._id) === -1 ?
                    <RedButton click={buyItem} text={lang === 'ua' ? 'Купити' : 'Купить'} />
                    :
                    <RedButton click={buyItem} customStyle={2} text={lang === 'ua' ? 'Додано в кошик' : 'Добавлено в корзину'} />
                  }
                  <div id="panel">
                    <div id="favorite">
                      <img src={favorite} alt="favorite" />
                      <span>{lang === 'ua' ? 'У обране' : 'В избранное'}</span>
                    </div>
                    <div id="compare">
                      <img src={scales} alt="compare" />
                      <span>{lang === 'ua' ? 'Порівняти' : 'Сравнить'}</span>
                    </div>
                  </div>
                  <hr />
                  <h3 id="main_features">{lang === 'ua' ? 'Ключові особливості' : 'Ключевые особенности'}</h3>
                  {
                    item.properties.slice(0, 3).map((property, index) => <Option {...property} key={`option_${index}`} />)
                  }
                  <hr />
                  <h3 id="availble_shops_title">{lang === 'ua' ? 'Магазини де можна забрати товар' : 'Магазины , где можно забрать товар'}</h3>
                  {
                    item.available_shops.length > 0 ?
                      <Fragment>
                        {
                          // eslint-disable-next-line
                          item.available_shops.slice(0, 1).map((shopId, index) => {
                            for (let city of cities) {
                              for (let shop of city.shops) {
                                if (shop._id === shopId) return <p className="available_shops" key={`${shopId}_${index}`} >{shop.name} - <b>{city.name[lang]}</b></p>;
                                else return null;
                              }
                            }
                          })
                        }
                      </Fragment>
                      :
                      <p className="available_shops">{lang === 'ua' ? 'Вибачте, але такого товару немає на складі' : 'Простите , но такого товара нет на складе'}</p>
                  }
                  <div id="colors">
                    {
                      item.themes.map(({ color }, index) => <Color item={item} red={red} grey={grey} pickedColorTheme={currentTheme} click={changeTheme} key={`color_${index}`} color={color} />)
                    }
                  </div>
                </div>
              </section>
              <section id="main_info_about">
                <div id="listOfProperties">
                  <h2>Характеристики</h2>
                  {
                    item.properties.map((property, index) => <Option {...property} key={`option_${index}`} />)
                  }
                  <h2>{lang === 'ua' ? `Відгуки та питання ${item.reviews.length}` : `Отзывы и вопросы ${item.reviews.length}`}</h2>
                  <RedButton click={openCommentMenu} text={lang === 'ua' ? 'Залишити відгук' : 'Оставить отзыв'} />
                  <div className="comments">
                    {item.reviews.length > 0 ?
                      <Fragment>
                        {showAllComments ?
                          <Fragment>
                            {
                              item.reviews.map((review, index) => <Review {...review} key={`review_${index}`} />)
                            }
                            <p id="showAllComments" onClick={() => { setShowAllComments(false) }}>{lang === 'ua' ? 'Приховати частину коментарів' : 'Скрыть часть комментариев'}</p>
                          </Fragment>
                          :
                          <Fragment>
                            {
                              item.reviews.slice(0, 3).map((review, index) => <Review {...review} key={`review_${index}`} />)
                            }
                            <p id="showAllComments" onClick={() => { setShowAllComments(true) }}>{lang === 'ua' ? 'Показати всі коментарі' : 'Показать все комментарии'}</p>
                          </Fragment>
                        }
                      </Fragment>
                      :
                      <h3 id="no_comments">{lang === 'ua' ? 'Коментарів поки що немає. Станете першим?' : 'Отзывов пока нет. Станьте первым!'}</h3>
                    }
                  </div>
                </div>
              </section>
            </Fragment>
          }
        </Fragment>
      }
    </div>
  )
}

export default ItemPage
