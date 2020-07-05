import React from 'react'
import ReactDOM from 'react-dom'

const grey_bg = (props) => {
  let style;
  if (typeof props.style === 'object') style = props.style;
  else style = {};
  return ReactDOM.createPortal(
    <div className="greyBG" onClick={props.click} style={style}>{props.children}</div>,
    document.getElementById('portal')
  )
};

export default grey_bg
