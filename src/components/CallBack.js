import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { info, css } from '../context'
import GreyBg from './GreyBG'
import CloseBtn from './CloseBtn'
import Input from './Input'
import RedButton from './RedButton'
import '../css/callback.css'

const CallBack = ({ close, input }) => {
  const { lang, domain, user, allInfoAboutUser } = useContext(info);
  const { text_light_grey, red } = useContext(css).colors;

  const [inputColor, setInputColor] = useState(text_light_grey);
  const [inputText, setInputText] = useState('');
  const condition = /^\+?(\d{2,3})?\s?\(?\d{2,3}\)?[ -]?\d{2,3}[ -]?\d{2,3}[ -]?\d{2,3}$/i;

  useEffect(() => {
    if (user && allInfoAboutUser) {
      setInputText(allInfoAboutUser.phone);
    }
  }, [user, allInfoAboutUser]);

  const closeWindow = () => {
    close(false);
  };

  const submitInput = async () => {
    if (condition.test(inputText)) {
      try {
        setInputText('');
        setInputColor(text_light_grey);
        const text = await axios.get(`http://${domain}/callMeBack`, { params: { number: inputText } });
        alert(text.data);
        close(false);
      }
      catch (err) {
        console.error(err.message);
        alert('Простите , что-то пошло не так');
      }
    }
    else {
      setInputColor(red);
    }
  };

  return (
    <GreyBg style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
      <div className="call_back">
        <CloseBtn click={closeWindow} />
        <h2>{lang === 'ua' ? 'Мы передзвоним' : 'Мы перезвоним'}</h2>
        <p>{lang === 'ua' ? 'Вкажіть свій номер телефону і ми вам зателефонуємо найближчим часом' : 'Укажите свой номер телефона и мы вам перезвоним в ближайшее время'}</p>
        <Input {...input} value={inputText} color={inputColor} input={setInputText} type="tel" />
        <RedButton text={lang === 'ua' ? 'Передзвонити' : 'Перезвонить'} click={submitInput} />
      </div>
    </GreyBg>
  )
}

CallBack.propTypes = {
  close: PropTypes.func.isRequired,
  input: PropTypes.exact({
    placeholder: PropTypes.string.isRequired,
    text: PropTypes.string
  })
};

export default CallBack


