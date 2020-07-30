import React, { useContext, Fragment, useState, useEffect } from 'react'
import { img, css, info } from '../context'

function Shop({ click, id, days, name, isChecked }) {
  const { arrow_sign } = useContext(img);
  const { light_grey, white } = useContext(css).colors;
  const { lang } = useContext(info);

  const [degrees, setDegrees] = useState('rotate(0deg)');
  const [timeTable, isTimbeTalbeOpen] = useState(false);
  const [backgroundOfShop, setBackgroundOfShop] = useState(white);

  useEffect(() => {
    if (isChecked) {
      setBackgroundOfShop(light_grey);
      setDegrees('rotate(-180deg)');
      isTimbeTalbeOpen(true);
    }
    else {
      setBackgroundOfShop(white);
      setDegrees('rotate(0deg)');
      isTimbeTalbeOpen(false);
    }
  }, [isChecked, light_grey, white]);

  const openTimeTable = e => {
    if (timeTable) {
      setBackgroundOfShop(white);
      setDegrees('rotate(0deg)');
    }
    else {
      setBackgroundOfShop(light_grey);
      setDegrees('rotate(-180deg)');
    }
    isTimbeTalbeOpen(!timeTable);
    click(e);
  }

  return (
    <Fragment>
      <div data-id={id} className="shop" onClick={openTimeTable} style={
        {
          backgroundColor: backgroundOfShop
        }
      }>
        <div className="shop_1" data-id={id}>
          <div className="info" data-id={id}>
            <p className="noselect" data-id={id}>{name}</p>
            {!timeTable && <span data-id={id} className="noselect">Сегодня с 10:00 - 21:00</span>}
          </div>
          <img data-id={id} src={arrow_sign} alt="arrow" className="arrow" style={{ transform: degrees }} />
        </div>
        <div data-id={id} className="shop_2">
          {timeTable &&
            <Fragment>
              <span data-id={id}>График работы</span>
              <ul data-id={id}>
                {
                  days.map((i, index) => (
                    <li key={`li_${index}`} data-id={id}>{i.day[lang]} {i.time}</li>
                  ))
                }
              </ul>
            </Fragment>
          }
        </div>
      </div>
      <hr className="shop_hr" />
    </Fragment>
  )
}

export default Shop
