import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { info, img } from '../context'

const NotFound = ({ errorMessage }) => {
  const { lang } = useContext(info);
  const { pageNotFoundFace } = useContext(img);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ textAlign: 'center', textDecoration: 'none' }}>{errorMessage[lang]}</h1>
      <img src={pageNotFoundFace} alt="404" style={{ width: '30vw', marginBottom: '15px' }} />
      <Link to="/" style={{ textDecoration: 'underline' }}>{lang === 'ua' ? 'Повернутися на головну' : 'Вернуться на главную'}</Link>
    </div>
  );
}

export default NotFound
