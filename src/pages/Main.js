import React, { Fragment, useEffect, useState, useContext } from 'react'
import SlidingPartHOC from '../components/SlidingPart'
import Slider from '../components/Slider'
import TopItems from '../components/TopItems'

import { img, info, css } from '../context'
import axios from 'axios'
import '../css/main.css'

const Main = () => {
  const { truck, checked, like } = useContext(img);
  const { red } = useContext(css).colors;
  const { text } = useContext(css).fonts;
  const { lang } = useContext(info);
  const [photosForSlider, setPhotosForSlider] = useState([]);

  const ActualSlider = SlidingPartHOC(Slider, {
    slides: photosForSlider,
  });

  useEffect(() => {
    axios.get('http://localhost:8080/getSlides')
      .then(slides => {
        setPhotosForSlider(slides.data.slides);
      })
      .catch(err => {
        console.error(err.message);
      });
  }, []);

  return (
    <Fragment>
      <ActualSlider slides={photosForSlider} />
      <div id="info_about_us">
        <div className="info_about_us_block">
          <img src={like} alt="info" />
          <span>{lang === 'ua' ? 'Поповнення рахунку без комісії' : 'Пополнение счета без комиссии'}</span>
        </div>
        <div className="info_about_us_block">
          <img src={truck} alt="info" />
          <span>{lang === 'ua' ? 'Безкоштовна доставка в магазини' : 'Бесплатная доставка в магазины'}</span>
        </div>
        <div className="info_about_us_block">
          <img src={checked} alt="info" />
          <span>{lang === 'ua' ? 'Офіційна гарантія від виробника' : 'Официальная гарантия от производителя'}</span>
        </div>
      </div>
      <h2 id="bestChoiceForToday" style={{ fontFamily: text }}>
        {lang === 'ua' ? 'Найкращі пропозиції на' : 'Лучшие предложения на'}
        <span style={{ color: red, fontFamily: text }}>
          {lang === 'ua' ? ' сьогодні' : ' сегодня'}
        </span>
      </h2>
      <TopItems />
    </Fragment>
  )
}

export default Main
