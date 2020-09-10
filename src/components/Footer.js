import React, { useContext, useState, Fragment } from 'react'
// eslint-disable-next-line
import { Link } from 'react-router-dom'

import { img, css, info } from '../context'


const Footer = () => {
  const { fb, insta, tw, yt, vvmc, visa, mc, arrow_sign_white } = useContext(img);
  const { text_light_grey } = useContext(css).colors;
  const { lang, resolution } = useContext(info);

  const FooterButton = ({ links, name }) => {

    const [display, setDisplay] = useState('none');

    const openSection = () => {
      if (display === 'none') setDisplay('flex');
      else setDisplay('none');
    };

    return <div className="footer_section">
      {resolution < 1024 &&
        <Fragment>
          <button onClick={openSection}>{name} <img alt="arrow" src={arrow_sign_white} /></button>
          <div style={{ display: display }} className="footer_section_links">
            {links.map((i, index) => <Link key={`footer_${index}`} to={i.link}>{i.name[lang]}</Link>)}
          </div>
        </Fragment>
      }
      {resolution >= 1024 &&
        <Fragment>
          <h3>{name}</h3>
          {
            links.map((i, index) => <Link key={`footer_${index}`} to={i.link}>{i.name[lang]}</Link>)
          }
        </Fragment>
      }
    </div>;
  };


  return (
    <footer>
      <div id="footer_wrapper">
        <div id="footer_info">
          <div id="social_medias">
            <a href="https://www.facebook.com/" rel="noopener noreferrer" target="_blank">
              <img src={fb} alt="social_media" />
            </a>
            <a href="https://www.instagram.com/" rel="noopener noreferrer" target="_blank">
              <img src={insta} alt="social_media" />
            </a>
            <a href="https://twitter.com" rel="noopener noreferrer" target="_blank">
              <img src={tw} alt="social_media" />
            </a>
            <a href="https://youtube.com" rel="noopener noreferrer" target="_blank">
              <img src={yt} alt="social_media" />
            </a>
          </div>
          <div id="payments">
            <img src={vvmc} alt="payment" />
            <img src={visa} alt="payment" />
            <img src={mc} alt="payment" />
          </div>
          <a id="footer_tel" href="tel:0800404040">0 800 40 40 40</a>
          <p>ООО "ВФ РИТЕЙЛ"</p>
          <p>Бесплатно с мобильных и стационарных по Украине</p>
          <p style={{ color: text_light_grey }}>График работы контактного центра</p>
          <p className="footer_time_table">Ежедневно 8:00 - 22:00</p>
        </div>
        <FooterButton name={lang === 'ua' ? 'Інтернет-магазин' : 'Интернет-магазин'} links={[{ name: { ru: 'О магазине', ua: 'Про магазин' }, link: '/' }, { name: { ru: 'Адреса магазинов', ua: 'Адреси магазинів' }, link: '/' }, { name: { ru: 'Акции', ua: 'Акції' }, link: '/' }, { name: { ru: 'Контакты', ua: 'Контакти' }, link: '/' }, { name: { ru: 'Условия использования сайта', ua: 'Умови використання сайту' }, link: '/' }]} />
        <FooterButton name={lang === 'ua' ? 'Допомога покупцеві' : 'Помощь покупателю'} links={[{ name: { ru: 'Доставка и оплата', ua: 'Доставка та оплата' }, link: '/' }, { name: { ru: 'Возврат товара', ua: 'Повернення товару' }, link: '/' }, { name: { ru: 'Гарантия', ua: 'Гарантія' }, link: '/' }, { name: { ru: 'Договор публичной оферты', ua: 'Договір публічної оферти' }, link: '/' }]} />
      </div>
    </footer>
  )
}

export default Footer
