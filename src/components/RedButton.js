import React from 'react'
import PropTypes from 'prop-types'

const RedButton = props => {
  const { text , click } = props;
  return (
    <button className="redBtn" onClick={click}>{text}</button>
  )
}

RedButton.propTypes = {
  text: PropTypes.string.isRequired,
  click: PropTypes.func
};

export default RedButton
