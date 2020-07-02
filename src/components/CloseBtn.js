import React from 'react'
import cross from '../img/cross.svg'
import crossWhite from '../img/crossWhite.svg'

const CloseBtn = props => {
  let color;
  switch (props.theme) {
    case 0: color = cross; break;
    case 1: color = crossWhite; break;
    default: color = cross;
  }
  return (
    <button onClick={props.click} className="closeBtn" style={{ backgroundImage: `url('${color}')` }} />
  )
}

export default CloseBtn
