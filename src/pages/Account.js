import React, { Fragment, useContext, useEffect, useState } from 'react'
import RedBtn from '../components/RedButton'
import Input from '../components/Input'
import AlertWindow from '../components/AlertWinodw'
import BoughtItems from '../components/BougthItems'
import LatelySeen from '../components/LatelySeen'

import axios from 'axios'
import { info, css, img } from '../context'
import '../css/account.css'

const UserUnauthorised = ({ showRegistration, setUserLoggedIn }) => {
  // eslint-disable-next-line
  const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const { lang, domain, changeUserObject, lookForUserExistence } = useContext(info);
  const { red, grey } = useContext(css).colors;

  const [isCodeAccepted, setAcceptCode] = useState(false);
  const [showRegField, setShowRegField] = useState(showRegistration);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [alertMessage, setAlertMessage] = useState('Error');
  const [isShowAlertMessage, setShowAlertMessage] = useState(false);

  const [isNameCorrect, setNameCorrect] = useState(true);
  const [isEmailCorrect, setEmailCorrect] = useState(true);
  const [isPasswordCorrect, setPasswordCorrect] = useState(true);
  const [isAddPasswordCorrect, setAddPasswordCorrect] = useState(true);

  function checkCorrect() {
    // Validation of form (both authorisation and registration)
    let nameC = true;
    let emailC = true;
    let passwordC = true;
    let addPasswordC = true;
    if ([...name].length < 2) {
      setNameCorrect(false);
      nameC = false;
    }
    if (!emailRegEx.test(email)) {
      setEmailCorrect(false);
      emailC = false;
    }
    if ([...password].length < 6) {
      setAlertMessage('Пароль должен состоять не меньше чем из 6 символов');
      openAlert();
      setPasswordCorrect(false);
      passwordC = false;
    }
    if (password !== confirmPassword || confirmPassword === '') {
      setAddPasswordCorrect(false);
      addPasswordC = false;
    }
    return { nameC, emailC, passwordC, addPasswordC };
  }

  function changeCode(code) {
    setCode(code);
  }

  function changeName(name) {
    setNameCorrect(true);
    setName(name);
  }

  function changeEmail(email) {
    setEmailCorrect(true);
    setEmail(email);
  }

  function changePassword(password) {
    setPasswordCorrect(true);
    setPassword(password);
  }

  function changeConfirmingPassword(password) {
    setAddPasswordCorrect(true);
    setConfirmPassword(password);
  }

  async function authorisate() {
    const { emailC, passwordC } = checkCorrect();
    if (emailC && passwordC) {
      const { data } = await axios.post(`http://${domain}/authorisation`, { email, password });
      switch (data) {
        case 'Something went wrong':
          setEmailCorrect(false);
          setPasswordCorrect(false);
          setAlertMessage('Данные введены неверно');
          openAlert();
          break;
        case 'User has not accepted his code':
          setAcceptCode(true);
          break;
        case 'Okay':
          localStorage.setItem('user', JSON.stringify({ email, pass: password }));
          changeUserObject();
          await lookForUserExistence();
          setUserLoggedIn(true);
          break;
        default:
          setAlertMessage('Something went wrong');
          openAlert();
          break;
      }
    }
  }

  async function acceptCode() {
    try {
      const { data } = await axios.post(`http://${domain}/acceptCode`, { email, code });
      switch (data) {
        case 'Such user does not exist':
          setAlertMessage('Такого пользователя не существует');
          openAlert();
          setAcceptCode(false);
          setShowRegField(true);
          clearForm();
          break;
        case 'Data is not valid':
          setAlertMessage('Данные введены неверно');
          openAlert();
          break;
        case 'Accepted':
          localStorage.setItem('user', JSON.stringify({ email, pass: password }));
          changeUserObject();
          lookForUserExistence();
          setUserLoggedIn(true);
          break;
        case 'Codes are not equal':
          setAlertMessage('Код не верен , попробуйте еще раз');
          openAlert();
          break;
        default:
          setAlertMessage('Неизветсная ошибка , попробуйте снова');
          openAlert();
          break;
      }
    }
    catch ({ message }) {
      console.error(message);
    }
  }

  async function registrate() {
    const { nameC, emailC, passwordC, addPasswordC } = checkCorrect();
    if (nameC && emailC && passwordC && addPasswordC) {
      if (password === confirmPassword) {
        try {
          const { data } = await axios.post(`http://${domain}/registrate`, { password, email, name, lang });
          switch (data) {
            case 'This user already exists': changeForm(); break; // If user already exists and has already accepted his code
            case 'Data is not valid':
              setAlertMessage('Данные введены неверно , попробуйте снова');
              openAlert();
              break; // If data is not valid
            case 'Let user enter the code': setAcceptCode(true); break; // If user hasn't existed yet
            case 'Code has not been accepted': setAcceptCode(true); break; // If user already exists but hasn't accepted his code yet
            default:
              setAlertMessage('Неизвестная ошибка , попробуйте снова');
              openAlert();
              break; // default
          }
        }
        catch ({ message }) {
          setAlertMessage('Неизвестная ошибка , попробуйте снова');
          openAlert();
        }
      }
      else {
        setAlertMessage('Подтвердите пароль');
        openAlert();
      }
    }
  }

  function openAlert() {
    setShowAlertMessage(!isShowAlertMessage);
  }

  function clearForm() {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNameCorrect(true);
    setEmailCorrect(true);
    setPasswordCorrect(true);
    setAddPasswordCorrect(true);
  }

  function changeForm() {
    // Changes form from the sign up to sign in and vice versa
    clearForm();
    setShowRegField(!showRegField);
  }

  return <div className="form">
    <AlertWindow text={alertMessage} isMessageShown={isShowAlertMessage} closeItself={openAlert} />
    {!isCodeAccepted &&
      <Fragment>
        {showRegField ?
          <Fragment>
            <h3>{lang === 'ua' ? 'Реєстрація' : 'Регистрация'}</h3>
            <Input value={name} input={changeName} placeholder={lang === 'ua' ? 'Ім\'я' : 'Имя'} color={isNameCorrect ? grey : red} />
            <Input value={email} type="email" input={changeEmail} placeholder={lang === 'ua' ? 'Пошта' : 'Почта'} color={isEmailCorrect ? grey : red} />
            <Input value={password} input={changePassword} placeholder="Пароль" type="password" color={isPasswordCorrect ? grey : red} />
            <Input value={confirmPassword} input={changeConfirmingPassword} placeholder={lang === 'ua' ? 'Підтвердити пароль' : 'Подтвердить пароль'} type="password" color={isAddPasswordCorrect ? grey : red} />
            <RedBtn click={registrate} text={lang === 'ua' ? 'Зарегестрировтися' : 'Зарегестрироваться'} />
            <p onClick={changeForm}>{lang === 'ua' ? 'Увійти' : 'Войти'}</p>
          </Fragment>
          :
          <Fragment>
            <h3>{lang === 'ua' ? 'Авторизація' : 'Авторизация'}</h3>
            <Input value={email} type="email" input={changeEmail} placeholder={lang === 'ua' ? 'Пошта' : 'Почта'} color={isEmailCorrect ? grey : red} />
            <Input value={password} input={changePassword} placeholder="Пароль" type="password" color={isPasswordCorrect ? grey : red} />
            <RedBtn text={lang === 'ua' ? 'Увійти' : 'Войти'} click={authorisate} />
            <p onClick={changeForm}>{lang === 'ua' ? 'Зарегестрировтися' : 'Зарегестрироваться'}</p>
          </Fragment>
        }
      </Fragment>
    }
    {isCodeAccepted &&
      <Fragment>
        <h3>{lang === 'ua' ? 'Код підтвердження' : 'Код подтверждения'}</h3>
        <Input value={code} input={changeCode} placeholder="Код" />
        <RedBtn text={lang === 'ua' ? 'Підтвердити' : 'Подтвердить'} click={acceptCode} />
      </Fragment>
    }
  </div>;
}

const UserAuthorised = () => {
  // If user is logged in
  const [isUserProperties, setIsUserProperties] = useState(false);
  const [phoneNumberProp, setPhoneNumberProp] = useState('');
  const [isAlertShown, setAlertShown] = useState(false);
  const { user, allInfoAboutUser, domain, lang, changeAllInfoAboutUser, changeUserObject } = useContext(info);
  const { no_account_logo, settings } = useContext(img);
  let photo, name, email, phone;
  if (allInfoAboutUser !== null) {
    photo = allInfoAboutUser.photo;
    name = allInfoAboutUser.name;
    email = allInfoAboutUser.email;
    phone = allInfoAboutUser.phone;
  }

  function closeAlert() {
    setAlertShown(!isAlertShown);
  }

  function showUserProperties() {
    setIsUserProperties(!isUserProperties);
    setPhoneNumberProp('');
  }

  function changePhoneNumber(value) {
    setPhoneNumberProp(value);
  }

  function logOut() {
    localStorage.removeItem('user');
    changeUserObject();
    changeAllInfoAboutUser({});
  }

  async function sendRequest() {
    // Sends new phone and the avatar
    const condition = /^\+?(\d{2,3})?\s?\(?\d{2,3}\)?[ -]?\d{2,3}[ -]?\d{2,3}[ -]?\d{2,3}$/i;
    if (condition.test(phoneNumberProp) || [...phoneNumberProp].length === 0) {
      const formData = new FormData();
      const file = document.getElementById('file').files[0];
      formData.append('file', file);
      formData.append('phone', phoneNumberProp);
      formData.append('email', user.email);
      formData.append('password', user.pass);
      await axios.post(`http://${domain}/changeUserParams`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    else {
      closeAlert();
    }
  }

  return <Fragment>
    {user !== null && allInfoAboutUser && allInfoAboutUser.bought && allInfoAboutUser.latelySeen && !isUserProperties &&
      <div className="authorised_account">
        <div className="account_heading">
          <div className="a_h_heading">
            <h1>{name}</h1>
            <img src={settings} onClick={showUserProperties} alt="settings" title="Настройки" />
          </div>
          <div className="account_info">
            <div className="account_photo" style={{ backgroundImage: `url('${photo === 'default' ? no_account_logo : `http://${domain}/${photo}`}')` }} />
            <div className="account_info_text">
              <p>Email: {email}</p>
              <p>Телефон: {phone === null ? (lang === 'ua' ? 'Не вказан' : 'Не указан') : phone}</p>
            </div>
          </div>
        </div>
        <hr />
        <h3>{lang === 'ua' ? 'Нещодавно переглянуті' : 'Недавно просмотренные'}</h3>
        {allInfoAboutUser.latelySeen.length > 0 ? <LatelySeen /> : <p>{lang === 'ua' ? 'Нічого не знайдено' : 'Ничего не найдено'}</p>}
        <h3>{lang === 'ua' ? 'Куплені вами' : 'Купленные вами'}</h3>
        {allInfoAboutUser.bought.length > 0 ? <BoughtItems /> : <p>{lang === 'ua' ? 'Нічого не знайдено' : 'Ничего не найдено'}</p>}
      </div>
    }
    {isUserProperties &&
      <div id="user_properties">
        <AlertWindow text={lang === 'ua' ? 'Телефон введен невірно' : 'Телефон был введен неверно'} closeItself={closeAlert} isMessageShown={isAlertShown} />
        <p id="get_back_to_user" onClick={showUserProperties}>Назад</p>
        <p>{lang === 'ua' ? 'Оберiть аватарку' : 'Выберите аватарку'}</p>
        <input name="file" id="file" type="file" />
        <p>{lang === 'ua' ? 'Змінити телефон' : 'Изменить телефон'}</p>
        <Input value={phoneNumberProp} input={changePhoneNumber} placeholder="+380 XX XX XXX" />
        <RedBtn click={sendRequest} text={lang === 'ua' ? 'Підтвердити' : 'Подтвердить'} />
        <span onClick={logOut}>{lang === 'ua' ? 'Вийти з аккаунта' : 'Выйти из аккаунта'}</span>
      </div>
    }
  </Fragment>;
}

const Account = () => {
  const { user, domain } = useContext(info);
  const { loading } = useContext(img);
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const [decision, setDecision] = useState(false);

  useEffect(() => {
    // Looking for the user in localStorage
    async function doesSuchUserExist() {
      const { data } = await axios.post(`http://${domain}/authorisation`, { email: user.email, password: user.pass });
      setDecision(true);
      return data;
    }

    if (user) {
      if (user.email && user.pass) {
        doesSuchUserExist().then(info => {
          if (info === 'Okay') setUserLoggedIn(true);
          else setUserLoggedIn(false);
          setDecision(true);
        });
      }
      else {
        setUserLoggedIn(false);
        setDecision(true);
      }
    }
    else {
      setUserLoggedIn(false);
      setDecision(true);
    }
  }, [user, domain]);

  return (
    <Fragment>
      { decision ?
        <div className="accountPage"> {isUserLoggedIn ? <UserAuthorised /> : <UserUnauthorised setUserLoggedIn={setUserLoggedIn} showRegistration={false} />} </div>
        :
        <img className="loading_img" src={loading} alt="loading" />
      }
    </Fragment>
  );
}

export default Account
