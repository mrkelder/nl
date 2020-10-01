import React, { Fragment, useContext, useEffect, useState } from 'react'
import RedBtn from '../components/RedButton'
import Input from '../components/Input'
import AlertWindow from '../components/AlertWinodw'

import axios from 'axios'
import { info } from '../context'
import '../css/account.css'

const UserUnauthorised = ({ showRegistration, setUserLoggedIn }) => {
  // eslint-disable-next-line
  const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const { lang, domain } = useContext(info);

  const [isCodeAccepted, setAcceptCode] = useState(false);
  const [showRegField, setShowRegField] = useState(showRegistration);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [alertMessage, setAlertMessage] = useState('Error');
  const [isShowAlertMessage, setShowAlertMessage] = useState(false);

  function changeCode(code) {
    setCode(code);
  }

  function changeName(name) {
    setName(name);
  }

  function changeEmail(email) {
    setEmail(email);
  }

  function changePassword(password) {
    setPassword(password);
  }

  function changeConfirmingPassword(password) {
    setConfirmPassword(password);
  }

  async function authorisate() {
    const { data } = await axios.post(`http://${domain}/authorisation`, { email, password });
    switch (data) {
      case 'Something went wrong':
        setAlertMessage('Данные введены неверно');
        openAlert();
        break;
      case 'User has not accepted his code':
        setAcceptCode(true);
        break;
      case 'Okay':
        localStorage.setItem('user', JSON.stringify({ email, pass: password }));
        setUserLoggedIn(true);
        break;
      default:
        console.error('Something went wrong , do nothing');
        break;
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
    // TODO: Notice the user about his potential mistakes with registration
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

  function openAlert() {
    setShowAlertMessage(!isShowAlertMessage);
  }

  function clearForm() {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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
            <Input value={name} input={changeName} placeholder={lang === 'ua' ? 'Ім\'я' : 'Имя'} />
            <Input value={email} input={changeEmail} placeholder={lang === 'ua' ? 'Пошта' : 'Почта'} />
            <Input value={password} input={changePassword} placeholder="Пароль" type="password" />
            <Input value={confirmPassword} input={changeConfirmingPassword} placeholder={lang === 'ua' ? 'Підтвердити пароль' : 'Подтвердить пароль'} type="password" />
            <RedBtn click={registrate} text={lang === 'ua' ? 'Зарегестрировтися' : 'Зарегестрироваться'} />
            <p onClick={changeForm}>{lang === 'ua' ? 'Увійти' : 'Войти'}</p>
          </Fragment>
          :
          <Fragment>
            <h3>{lang === 'ua' ? 'Авторизація' : 'Авторизация'}</h3>
            <Input value={email} input={changeEmail} placeholder={lang === 'ua' ? 'Пошта' : 'Почта'} />
            <Input value={password} input={changePassword} placeholder="Пароль" type="password" />
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
  return <Fragment></Fragment>
}

const Account = () => {
  const { user, domain } = useContext(info);
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    // Looking for the user in localStorage

    async function doesSuchUserExist() {
      const { data } = await axios.post(`http://${domain}/authorisation`, { email: user.email, password: user.pass });
      return data;
    }

    if (user) {
      doesSuchUserExist().then(info => {
        if (info === 'Okay') setUserLoggedIn(true);
        else setUserLoggedIn(false);
      });
    }
    else {
      setUserLoggedIn(false);
    }
    // if (user !== undefined) {
    //   // Checking does user exist in localStorage and if so is its data properly written
    //   try {
    //     // Tries to access user's object
    //     const { name, pass } = user;
    //     if ([...name].length > 0 && [...pass].length > 0) {
    //       setUserLoggedIn(true);
    //     }
    //     else {
    //       setUserLoggedIn(false);
    //     }
    //   }
    //   catch (err) {
    //     // If user's object is inappropriate
    //     console.log(err.message)
    //     console.error('This user is not a requied object');
    //     setUserLoggedIn(false);
    //   }
    // }
    // else setUserLoggedIn(false);
  }, [user, domain]);

  return <div className="accountPage"> {isUserLoggedIn ? <UserAuthorised /> : <UserUnauthorised setUserLoggedIn={setUserLoggedIn} showRegistration={true} />} </div>;
}

export default Account
