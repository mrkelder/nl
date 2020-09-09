import React, { useState, useContext } from 'react'
import { img, css } from '../context'
import PropTypes from 'prop-types'

function FadeButton({ text, isOpened, children }) {

  const [isButtonOpened, setButtonOpened] = useState(isOpened);
  const { arrow_sign } = useContext(img);
  const { light_grey, white } = useContext(css).colors;

  const openAdditoinalContent = () => {
    setButtonOpened(!isButtonOpened);
  }

  return (
    <div className="fade_button" style={isButtonOpened ? { backgroundColor: light_grey } : { backgroundColor: white }}>
      <div className="fb_first" onClick={openAdditoinalContent}>
        <p>{text}</p>
        <img src={arrow_sign} className="arrow_btn" alt="arrow" style={isButtonOpened ? { transform: "rotate(180deg)" } : { transform: "rotate(0deg)" }} />
      </div>
      {isButtonOpened &&
        <div className="fd_second">
          {children}
        </div>
      }
    </div>
  )
}

FadeButton.propTypes = {
  text: PropTypes.string,
  isOpened: PropTypes.bool,
  children: PropTypes.array
}

export default FadeButton
