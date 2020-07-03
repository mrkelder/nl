import React from 'react'

const grey_bg = (props) => {
  let style;
  if (typeof props.style === 'object') style = props.style;
  else style = {};
  return (<div className="greyBG" onClick={props.click} style={style}>{props.children}</div>)
};

export default grey_bg
