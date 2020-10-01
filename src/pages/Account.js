import React, { Fragment, useContext, useEffect, useState } from 'react'
import RedBtn from '../components/RedButton'
import Input from '../components/Input'
import AlertWindow from '../components/AlertWinodw'

import axios from 'axios'
import { info, css } from '../context'
import '../css/account.css'

const UserUnauthorised = ({ showRegistration, setUserLoggedIn }) => {
  // eslint-disable-next-line
  const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const { lang, domain } = useContext(info);
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
    if ([...password].length < 5) {
      setPasswordCorrect(false);
      passwordC = false;
    }
    if (password !== confirmPassword) {
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
  }, [user, domain]);

  return <div className="accountPage"> {isUserLoggedIn ? <UserAuthorised /> : <UserUnauthorised setUserLoggedIn={setUserLoggedIn} showRegistration={true} />} </div>;
}

export default Account
