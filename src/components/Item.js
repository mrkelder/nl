import React, { useEffect, useContext, useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import RedButton from './RedButton'
import { img, info } from '../context'
import PropTypes from 'prop-types'

const Item = ({ name, price, rating, link, photo, style, properties }) => {

  const roundedPrice = Math.round(rating);
  const { resolution, lang, domain, addItemToBin } = useContext(info);

  const { star, star_active, bin, favorite, trippleDots, scales, crossWhite } = useContext(img);
  const [stars, setStars] = useState([]);
  const [isItem2MenuOpen, setItem2MenuOpen] = useState(false);

  useEffect(() => {
    setStars(new Array(roundedPrice).fill(0));
  }, [roundedPrice]);

  const makeUndraggble = e => { e.target.setAttribute('draggable', false) };

  const openItem2SubMenu = () => {
    setItem2MenuOpen(!isItem2MenuOpen);
  };

  if (roundedPrice < 0 || roundedPrice > 5) throw new Error('Rating does not fit the requirements')
  else return (
    <div className={`item${style}`}>
      {!(resolution >= 1024 && style === 3) &&
        <Fragment>
          {style !== 3 ?
            <img src={`http://${domain}/${photo}`} alt="item_photo" onMouseDown={makeUndraggble} className="noselect" />
            :
            <div className="noselect item3_img" style={{ backgroundImage: `url('http://${domain}/${photo}')` }} onMouseDown={makeUndraggble} />
          }
        </Fragment>
      }
      {style === 3 && resolution < 1024 &&
        <div className="item3SideInfo">
          {name !== undefined &&
            <Link to={`/item/${link}`}>
              <span className="name noselect">{[...name].length >= 21 ? `${[...name].slice(0, 18).join('')}...` : name}</span>
            </Link>
          }
          <span className="price noselect">{`${price} грн`}</span>
        </div>
      }
      {name !== undefined && style !== 3 &&
        <Link to={`/item/${link}`}>
          <span className="name noselect">{[...name].length >= 28 ? `${[...name].slice(0, 18).join('')}...` : name}</span>
        </Link>
      }
      {style === 3 && resolution < 1024 && <br />}
      {!(resolution >= 1024 && style === 3) &&
        <Fragment>
          {!(resolution < 1024 && (style === 2 || style === 3)) &&
            <div className="itemStars">
              {
                stars.map((i, index) => <img src={star_active} key={`star_${index}`} alt="active_star" className="star noselect" onMouseDown={makeUndraggble} />)
              }
              {
                new Array(5 - roundedPrice).fill(0).map((i, index) => <img src={star} key={`star_${index}`} alt="star" className="star noselect" onMouseDown={makeUndraggble} />)
              }
            </div>
          }
          {!(resolution < 1024 && (style === 2 || style === 3)) &&
            <span className="price noselect">{`${price} грн`}</span>
          }
          {!(resolution < 1024 && (style === 2 || style === 3)) &&
            <div className="topItemButtons">
              <Link to={`/item/${link}`}>
                <RedButton text={lang === 'ua' ? 'Детальніше' : 'Подробнее'} />
              </Link>
              <img src={favorite} alt="favorite" />
              <img src={bin} alt="bin" />
            </div>
          }
        </Fragment>
      }
      {resolution < 1024 && style === 2 &&
        <div className="price_button">
          <span className="price noselect">{`${price} грн`}</span>
          <button onClick={openItem2SubMenu} style={{ backgroundImage: `url('${trippleDots}')` }} />
        </div>
      }
      {resolution < 1024 && style === 2 && isItem2MenuOpen &&
        <div className="item2_menu">
          <Link to={`/item/${link}`}>
            <RedButton text={lang === 'ua' ? 'Детальніше' : 'Подробнее'} />
          </Link>
          <RedButton text="В корзину" />
          <div className="item2_menu_bar">
            <button style={{ backgroundImage: `url('${favorite}')` }} />
            <button style={{ backgroundImage: `url('${scales}')` }} />
            <button onClick={openItem2SubMenu} style={{ backgroundImage: `url('${crossWhite}')` }} />
          </div>
        </div>
      }
      {resolution >= 1024 && style === 3 &&
        <Fragment>
          <div className="item3Img" style={{ backgroundImage: `url('http://${domain}/${photo}')` }} />
          <div className="item3Info">
            <Link to={`/item/${link}`}>
              <span className="name noselect">{[...name].length >= 21 ? `${[...name].slice(0, 18).join('')}...` : name}</span>
            </Link>
            <ul className="item3Properties">
              <li>
                <div className="itemStars">
                  {
                    stars.map((i, index) => <img src={star_active} key={`star_${index}`} alt="active_star" className="star noselect" onMouseDown={makeUndraggble} />)
                  }
                  {
                    new Array(5 - roundedPrice).fill(0).map((i, index) => <img src={star} key={`star_${index}`} alt="star" className="star noselect" onMouseDown={makeUndraggble} />)
                  }
                </div>
              </li>
              {properties !== undefined &&
                properties.slice(0, 4).map((i, index) => <li key={`property_${index}`}>{i.name} : {i.value}</li>)
              }
            </ul>
          </div>
          <div className="item3Panel">
            <span className="price">{price} грн</span>
            <Link to={`/item/${link}`}>
              <RedButton text={lang === 'ua' ? 'Детальніше' : 'Подробнее'} />
            </Link>
            <div className="item3MenuButtons">
              <div className="item3MenuButton">
                <img src={favorite} alt="favorite" />
                <span>{lang === 'ua' ? 'У обране' : 'В избранное'}</span>
              </div>
              <hr />
              <div className="item3MenuButton">
                <img src={scales} alt="scales" />
                <span>{lang === 'ua' ? 'Порівняти' : 'Сравнить'}</span>
              </div>
            </div>
          </div>
        </Fragment>
      }
    </div>
  )
}

Item.propTypes = {
  name: PropTypes.string,
  price: PropTypes.number,
  rating: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),
  link: PropTypes.string,
  photo: PropTypes.string
};

export default Item
