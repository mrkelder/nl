import React, { Fragment } from 'react'
import GreyBG from './GreyBG'
import RedBtn from './RedButton'
import cross from '../img/cross.svg'

function AlertWinodw({ text, isMessageShown, closeItself }) {
  return (
    <Fragment>
      { isMessageShown &&
        <GreyBG style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
          <div className="alertWidnow">
            <img src={cross} alt="cross" onClick={closeItself}/>
            <p>{text}</p>
            <RedBtn text="Ok" customStyle={3} click={closeItself} />
          </div>
        </GreyBG>
      }
    </Fragment>
  )
}

export default AlertWinodw
