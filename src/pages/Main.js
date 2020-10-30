import React, { Fragment, useEffect, useState, useContext } from 'react'
import TopItems from '../components/TopItems'
import Map from '../components/Map'

import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import { img, info, css } from '../context'
import axios from 'axios'
import '../css/main.css'
import { Link } from 'react-router-dom'

const Main = () => {
  const { truck, checked, like } = useContext(img);
  const { red } = useContext(css).colors;
  const { text } = useContext(css).fonts;
  const { lang, resolution, domain } = useContext(info);
  const [photosForSlider, setPhotosForSlider] = useState([]);
  const [banners, setBanners] = useState([]);

  SwiperCore.use([Autoplay]);

  useEffect(() => {
    // Fetching slides for the slider
    axios.get(`http://${domain}/getSlides`)
      .then(slides => {
        setPhotosForSlider(slides.data.slides);
      })
      .catch(err => {
        console.error(err.message);
      });
  }, [domain]);

  useEffect(() => {
    // Fetching banners
    axios.get(`http://${domain}/getBanners`)
      .then(banners => {
        setBanners(banners.data);
      })
      .catch(err => {
        console.error(err.message);
      });
  }, [domain]);

  return (
    <Fragment>
      <Swiper
        id="mainSlider"
        slidesPerView={1}
        autoplay={{
          disableOnInteraction: false
        }}
      >
        {photosForSlider.length > 0 &&
          photosForSlider.map(i => <SwiperSlide>
            {resolution < 1024 ?
              <div className="slide" style={{ backgroundImage: `url('http://${domain}/${i.mobile}')` }} /> :
              <div className="slide" style={{ backgroundImage: `url('http://${domain}/${i.pc}')` }} />
            }
          </SwiperSlide>)
        }
      </Swiper>
      {/* <ActualSlider /> */}
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
            <img className="banner" src={`http://${domain}/${banners[0].name}`} alt="banner" />
          </Link>
          <Link to={banners[1].link}>
            <img className="banner" src={`http://${domain}/${banners[1].name}`} alt="banner" />
          </Link>
        </div>
      }
      {/* {resolution >= 1024 && <Map />} */}
    </Fragment>
  )
}

export default Main
