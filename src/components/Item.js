import React, { useEffect, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import RedButton from './RedButton'
import { img, info } from '../context'
import PropTypes from 'prop-types'

const Item = ({ name, price, rating, link, photo, style }) => {

  const roundedPrice = Math.round(rating);
  const { resolution, lang } = useContext(info);

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
      <img src={`http://localhost:8080/${photo}`} alt="item_photo" onMouseDown={makeUndraggble} className="noselect" />
      {name !== undefined &&
        <span className="name noselect">{[...name].length >= 28 ? `${[...name].slice(0, 25).join('')}...` : name}</span>
      }
      {!(resolution < 1024 && style === 2) &&
        <div className="itemStars">
          {
            stars.map((i, index) => <img src={star_active} key={`star_${index}`} alt="active_star" className="star noselect" onMouseDown={makeUndraggble} />)
          }
          {
            new Array(5 - roundedPrice).fill(0).map((i, index) => <img src={star} key={`star_${index}`} alt="star" className="star noselect" onMouseDown={makeUndraggble} />)
          }
        </div>
      }

      {!(resolution < 1024 && style === 2) &&
        <span className="price noselect">{`${price} грн`}</span>
      }
      {resolution < 1024 && style === 2 &&
        <div className="price_button">
          <span className="price noselect">{`${price} грн`}</span>
          <button onClick={openItem2SubMenu} style={{ backgroundImage: `url('${trippleDots}')` }} />
        </div>
      }
      {!(resolution < 1024 && style === 2) &&
        <div className="topItemButtons">
          <Link to={`/item/${link}`}>
            <RedButton text={lang === 'ua' ? 'Детальніше' : 'Подробнее'} />
          </Link>
          <img src={favorite} alt="favorite" />
          <img src={bin} alt="bin" />
        </div>
      }
      {resolution < 1024 && style === 2 && isItem2MenuOpen &&
        <div className="item2_menu">
          <RedButton text={lang === 'ua' ? 'Детальніше' : 'Подробнее'} />
          <RedButton text="В корзину" />
          <div className="item2_menu_bar">
            <button style={{ backgroundImage: `url('${favorite}')` }} />
            <button style={{ backgroundImage: `url('${scales}')` }} />
            <button onClick={openItem2SubMenu} style={{ backgroundImage: `url('${crossWhite}')` }} />
          </div>
        </div>
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
