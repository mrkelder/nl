import React, { useEffect, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import RedButton from './RedButton'
import { img, info } from '../context'

const Item = ({ name, price, rating, link, photo }) => {

  const roundedPrice = Math.round(rating);
  const lang = useContext(info).lang;

  const { star, star_active, bin, favorite } = useContext(img);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setStars(new Array(roundedPrice).fill(0));
  }, [roundedPrice]);

  const makeUndraggble = e => { e.target.setAttribute('draggable', false) };

  if (roundedPrice < 0 || roundedPrice > 5) throw new Error('Rating does not fit the requirements')
  else return (
    <div className="item" to={link}>
      <img src={`http://localhost:8080/${photo}`} alt="item_photo" onMouseDown={makeUndraggble} className="noselect" />
      <span className="name noselect">{name}</span>
      <div className="itemStars">
        {
          stars.map((i, index) => <img src={star_active} key={`star_${index}`} alt="active_star" className="star noselect" onMouseDown={makeUndraggble} />)
        }
        {
          new Array(5 - roundedPrice).fill(0).map((i, index) => <img src={star} key={`star_${index}`} alt="star" className="star noselect" onMouseDown={makeUndraggble} />)
        }
      </div>
      <span className="price noselect">{`${price} грн`}</span>
      <div className="topItemButtons">
        <Link to={link}>
          <RedButton text={lang === 'ua' ? 'Детальніше' : 'Подробнее'} />
        </Link>
        <img src={favorite} alt="favorite"/>
        <img src={bin} alt="bin"/>
      </div>
    </div>
  )
}

export default Item
