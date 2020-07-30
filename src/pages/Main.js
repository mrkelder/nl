import React, { Fragment, useEffect, useState, useContext } from 'react'
import SlidingPartHOC from '../components/SlidingPart'
import Slider from '../components/Slider'
import TopItems from '../components/TopItems'
import Map from '../components/Map'

import { img, info, css } from '../context'
import axios from 'axios'
import '../css/main.css'
import { Link } from 'react-router-dom'

const Main = () => {
  const { truck, checked, like } = useContext(img);
  const { red } = useContext(css).colors;
  const { text } = useContext(css).fonts;
  const { lang , resolution} = useContext(info);
  const [photosForSlider, setPhotosForSlider] = useState([]);
  const [banners, setBanners] = useState([]);

  const ActualSlider = SlidingPartHOC(Slider, {
    slides: photosForSlider,
    isSlider: true
  });

  useEffect(() => {
    // Fetching slides for the slider
    axios.get('http://localhost:8080/getSlides')
      .then(slides => {
        setPhotosForSlider(slides.data.slides);
      })
      .catch(err => {
        console.error(err.message);
      });
  }, []);

  useEffect(() => {
    // Fetching banners
    axios.get('http://localhost:8080/getBanners')
      .then(banners => {
        setBanners(banners.data);
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
      {banners.length > 0 &&
        <div id="banners">
          <Link to={banners[0].link}>
            <img className="banner" src={`http://localhost:8080/${banners[0].name}`} alt="banner" />
          </Link>
          <Link to={banners[1].link}>
            <img className="banner" src={`http://localhost:8080/${banners[1].name}`} alt="banner" />
          </Link>
        </div>
      }
      {resolution >= 1024 && <Map />}
    </Fragment>
  )
}

export default Main
