import React, { useEffect, useContext, Fragment, useState } from 'react'
import RedButton from '../components/RedButton'
import Input from '../components/Input'
import { PayPalButton } from "react-paypal-button-v2";

import { Link, useHistory } from 'react-router-dom'
import { info, img } from '../context'
import success from '../img/success.png'
import fail from '../img/fail.png'
import '../css/bin.css'

const Item = ({ id, name, photo, price }) => {
  const { domain, removeItemFromBin } = useContext(info);
  const { cross } = useContext(img);

  function removeItem() {
    removeItemFromBin(id);
  }

  return <div className="binItem">
    <div className="photo" style={{ backgroundImage: `url('http://${domain}/${photo}')` }} />
    <div className="info">
      <Link to={`/item/${id}`}>{[...name].length > 40 ? `${[...name].slice(0, 40).join('')}...` : name}</Link>
      <p className="price">{price} грн</p>
    </div>
    <img src={cross} alt="cross" onClick={removeItem} />
  </div>;
}

function Bin() {
  const { bin, lang, resolution, user, allInfoAboutUser, removeItemFromBin } = useContext(info);
  const { pageNotFoundFace } = useContext(img);
  const history = useHistory();
  const [dataAboutUser, setDataAboutUser] = useState('');
  const [postOffice, setPostOffice] = useState('');
  const [amount, setAmount] = useState(0);
  const [checkout, setCheckout] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  useEffect(() => {
    if (!(user && allInfoAboutUser)) {
      history.push('/account');
    }
  }, [user, allInfoAboutUser, history]);

  function makeOrder() {
    if (bin.length > 0) {
      let totalPrice = 0;
      bin.forEach(i => totalPrice += i.themes[i.themeIndex].price);
      setAmount(totalPrice * 2);
      setCheckout(true);
      window.scroll({ top: 0 });
    }
  }

  function changeUserData(e) {
    setDataAboutUser(e);
  }

  function changePostOffice(e) {
    setPostOffice(e);
  }

  function successFunc(details, data) {
    setPaid(true);
    setResultReady(true);
    bin.forEach(({ _id }) => removeItemFromBin(_id));
  }

  function errorFunc() {
    setError(true);
    setResultReady(true);
  }

  return (
    <Fragment>
      { paid &&
        <div id="payment_result">
          <img src={success} alt="success" />
          <span>{lang === 'ua' ? "Ваше замовлення прийнято" : 'Ваш заказ принят'}</span>
          <Link to="/">{lang === 'ua' ? "Повернутися на головну" : 'Вернуться на главную'}</Link>
        </div>
      }
      { error &&
        <div id="payment_result">
          <img src={fail} alt="success" />
          <span>{lang === 'ua' ? "Вибачте, сталася помилка. Якщо ваші кошти були загублені, зв'яжіться з підтримкою" : 'Простите, произошла ошибка. Если ваши средства были утеряны, свяжитесь с поддержкой'}</span>
          <Link to="/">{lang === 'ua' ? "Повернутися на головну" : 'Вернуться на главную'}</Link>
        </div>
      }
      { !resultReady &&
        <Fragment>
          {checkout ?
            <div id="paymentPage">
              <h1>{lang === 'ua' ? 'Оформлення замовлення' : 'Оформление заказа'}</h1>
              <Input value={dataAboutUser} input={changeUserData} text={lang === 'ua' ? 'Особисті дані' : 'Персональные данные'} placeholder={lang === 'ua' ? "Ім'я Прізвище По-батькові одержувача" : 'Имя Фамилия Отчество получателя'} />
              <Input value={postOffice} input={changePostOffice} text={lang === 'ua' ? 'Відділення Нової Пошти' : 'Отделение Новой Почты'} placeholder={lang === 'ua' ? "Місто, вулиця відділення" : 'Город, улица отделения'} />
              {[...dataAboutUser].length > 0 && [...postOffice].length > 0 &&
                <PayPalButton
                  amount={amount}
                  onSuccess={successFunc}
                  onError={errorFunc}
                  options={{
                    'client-id': 'Aag1-0V8S2yhNI1fQ1WT6kgCw65XiNYZTeo_wGnynba03RNdCjRv9RpPz6mO5qU3DWUjtWn2wcIHVVDk',
                    currency: 'RUB'
                  }}
                />
              }
            </div>
            :
            <div id="binPage">
              {
                resolution < 1024 &&
                <Link to="/">
                  <span id="backToTheCatalog">{lang === 'ua' ? '< Повернутися на головну' : '< Вернуться на главную'}</span>
                </Link>
              }
              <h1>{lang === 'ua' ? 'Кошик' : 'Корзина'}</h1>
              {bin.length > 0 ?
                <div id="itemsExist">
                  {
                    bin.map(({ _id, name, themes ,themeIndex}) => <Item id={_id} key={_id} name={name} photo={themes[themeIndex].main_photo} price={themes[themeIndex].price} />)
                  }
                  <RedButton text={lang === 'ua' ? 'Оформити замовлення' : 'Оформить заказ'} click={makeOrder} />
                </div>
                :
                <Fragment>
                  <div id="noItemsMessage">
                    <h1 id="noItems">{lang === 'ua' ? 'Ваш кошик пустий' : 'Ваша корзина пуста'}</h1>
                    <img src={pageNotFoundFace} alt="notFound" id="notFoundImage" />
                  </div>
                </Fragment>
              }
            </div>
          }
        </Fragment>
      }
    </Fragment>
  );
}

export default Bin
