import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { img } from '../context'

const CloseBtn = props => {
  const imgContext = useContext(img);
  const { crossWhite, cross } = imgContext;
  let color;
  switch (props.theme) {
    case 0: color = cross; break;
    case 1: color = crossWhite; break;
    default: color = cross; break;
  }
  return (
    <button onClick={props.click} className="closeBtn" style={{ backgroundImage: `url('${color}')` }} />
  )
}

CloseBtn.propTypes = {
  theme: PropTypes.number,
  click: PropTypes.func.isRequired
};

export default CloseBtn
