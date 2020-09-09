import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { css } from '../context'

const RedButton = props => {
  const { text, click, customStyle } = props;
  const { red, white, light_grey, grey } = useContext(css).colors;
  let btnStyle = {};

  switch (customStyle) {
    case 1: btnStyle = { color: grey, backgroundColor: light_grey }; break;
    case 2: btnStyle = { color: red, backgroundColor: white }; break;
    case 3: btnStyle = { color: white, backgroundColor: red }; break;
    default: btnStyle = {}; break;
  }
  return <button className="redBtn" style={btnStyle} onClick={click}>{text}</button>;
}

RedButton.propTypes = {
  text: PropTypes.string.isRequired,
  click: PropTypes.func
};

export default RedButton
