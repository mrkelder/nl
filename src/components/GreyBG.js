import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const Grey_bg = props => {
  let style;
  if (typeof props.style === 'object') style = props.style;
  else style = {};
  return ReactDOM.createPortal(
    <div className="greyBG" onClick={props.click} style={style}>{props.children}</div>,
    document.getElementById('portal')
  )
};

Grey_bg.propTypes = {
  style: PropTypes.object,
  children: PropTypes.element,
  click: PropTypes.func
}

export default Grey_bg
