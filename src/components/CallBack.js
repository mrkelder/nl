import React, { useContext, useState } from 'react'
import axios from 'axios'
import { info, css } from '../context'
import GreyBg from './GreyBG'
import Input from './Input'
import RedButton from './RedButton'
import '../css/callback.css'

const CallBack = props => {
  const infoContext = useContext(info);
  const cssContext = useContext(css);

  const { close, input } = props;
  const { lang } = infoContext;

  const { text_light_grey, red } = cssContext.colors;
  const [inputColor, setInputColor] = useState(text_light_grey);
  const [inputText, setInputText] = useState('');
  const condition = /^\+?(\d{2,3})?\s?\(?\d{2,3}\)?[ -]?\d{2,3}[ -]?\d{2,3}[ -]?\d{2,3}$/i;

  const closeWindow = () => {
    close(false);
  };

  const submitInput = async () => {
    if (condition.test(inputText)) {
      setInputText('');
      setInputColor(text_light_grey);
      const text = await axios.get('http://localhost:8080/callMeBack', { params: { number: inputText } });
      alert(text.data);
      close(false);
    }
    else {
      setInputColor(red);
    }
  };

  return (
    <GreyBg style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
      <div className="call_back">
        <button className="closeBtn" onClick={closeWindow} />
        <h2>{lang === 'ua' ? 'Мы передзвоним' : 'Мы перезвоним'}</h2>
        <p>{lang === 'ua' ? 'Вкажіть свій номер телефону і ми вам зателефонуємо найближчим часом' : 'Укажите свой номер телефона и мы вам перезвоним в ближайшее время'}</p>
        <Input {...input} value={inputText} color={inputColor} input={setInputText} type="tel"/>
        <RedButton text={lang === 'ua' ? 'Передзвонити' : 'Перезвонить'} click={submitInput} />
      </div>
    </GreyBg>
  )
}

export default CallBack


