import React, { useEffect, useState, useContext, Fragment } from 'react'
import { Link } from 'react-router-dom';
import { info, img } from '../context'
import '../css/bin.css'

const Item = ({ id, name, photo, price }) => {
  const { domain, removeItemFromBin } = useContext(info);
  const { cross } = useContext(img);

  function removeItem() {
    removeItemFromBin(id);
  }

  return <div className="binItem">
    <div className="photo" style={{ backgroundImage: `url('http://${domain}/${photo}')` }} />
    <div className="info">
      <Link to={`/item/${id}`}>{[...name].length > 40 ? `${[...name].slice(0, 40).join('')}...` : name}</Link>
      <p className="price">{price} грн</p>
    </div>
    <img src={cross} alt="cross" onClick={removeItem} />
  </div>;
}

function Bin() {
  const { bin, lang, resolution } = useContext(info);
  const { pageNotFoundFace } = useContext(img);
  return (
    <div id="binPage">
      {
        resolution < 1024 &&
        <Link to="/">
          <span id="backToTheCatalog">{lang === 'ua' ? '< Повернутися на головну' : '< Вернуться на главную'}</span>
        </Link>
      }
      { bin.length > 0 ?
        <div id="itemsExist">
          {
            bin.map(({ _id, name, themes }) => <Item id={_id} key={_id} name={name} photo={themes[0].main_photo} price={themes[0].price} />)
          }
        </div>
        :
        <Fragment>
          <div id="noItemsMessage">
            <h1 id="noItems">{lang === 'ua' ? 'Ваш кошик пустий' : 'Ваша корзина пуста'}</h1>
            <img src={pageNotFoundFace} alt="notFound" id="notFoundImage" />
          </div>
        </Fragment>
      }
    </div>
  )
}

export default Bin
