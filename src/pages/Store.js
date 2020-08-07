import React, { useEffect, useState, useContext, Fragment } from 'react'
import axios from 'axios'

import { info, img } from '../context'
import { Link } from 'react-router-dom'
import '../css/store.css'

const Store = props => {
  const [canBeShown, setShowing] = useState(true);
  const [nameOfCategory, setNameOfCategory] = useState('');

  const { lang, resolution } = useContext(info);
  const { arrow_sign } = useContext(img);

  useEffect(() => {
    const propCategory = props.match.params.category;
    axios.get('http://localhost:8080/getCatalog').then(({ data }) => {
      let items = [];
      for (let item of data) {
        for (let i of item.items) {
          // Making a list of the all available links
          if (i.link === `/${propCategory}`) setNameOfCategory(i.name[lang]);
          items.push(i.link);
        }
      }
      // Compares the actual link with the available ones
      if (!items.includes(`/${propCategory}`)) setShowing(false);
      else setShowing(true);
    });
  }, [props , lang]);

  if (canBeShown) {
    return (
      <div id="store">
        <div id="bread_crumbs">
          {resolution < 1024 &&
            <Link to="/">{lang === 'ua' ? '< Інтернет-магазин New London' : '< Интернет-магазин New London'}</Link>
          }
          {resolution >= 1024 &&
            <Fragment>
              <Link to="/">{lang === 'ua' ? 'Інтернет-магазин New London' : 'Интернет-магазин New London'}</Link>
              <img src={arrow_sign} alt="arrow_sign" className="arrow"/>
              <Link to={props.location.pathname}>{nameOfCategory}</Link>
            </Fragment>
          }
        </div>
      </div>
    );
  }
  else {
    return <h1>404</h1>
  }
}

export default Store
