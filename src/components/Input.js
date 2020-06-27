import React from 'react'

const Input = props => {
  const { type, text, placeholder, color, input, value } = props;
  return (
    <div className="underlinedInput">
      {text === undefined ? null : <span>{text}</span>}
      <input
        value={value}
        type={type === undefined ? 'text' : type}
        placeholder={placeholder === undefined ? '' : placeholder}
        style={color === undefined ? {} : { borderBottomColor: color }}
        onChange={e => { input(e.target.value); }}
      />
    </div>
  )
}

export default Input
