import React from 'react'

const RedButton = props => {
  const { text , click } = props;
  return (
    <button className="redBtn" onClick={click}>{text}</button>
  )
}

export default RedButton
