import React, { Fragment, useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import { img } from '../context'

const Radio = ({ name, id, isCehcked, click, index }) => {
  const { radio, radio_checked } = useContext(img);
  const inpRef = useRef(null);
  const check = () => {
    click(index);
  }

  return (
    <Fragment>
      <label htmlFor={id}>
        <img className="radio_slider_img" src={isCehcked ? radio_checked : radio} alt="radio" />
      </label>
      <input className="radio_slider_input" type="radio" onChange={check} name={name} ref={inpRef} id={id} checked={isCehcked} />
    </Fragment>
  )
}

Radio.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  isCehcked: PropTypes.bool,
  click: PropTypes.func
};

export default Radio
