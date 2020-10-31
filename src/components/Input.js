import React, { Fragment, useContext } from 'react'
import { img } from '../context'
import PropTypes from 'prop-types'

const Input = props => {
  const { type, text, placeholder, color, input, value, isSearch, submit, id, addForCleaning } = props;

  const imgContext = useContext(img);
  const { search, crossRed } = imgContext;

  const cleanSearch = () => {
    if (addForCleaning) addForCleaning();
    input('');
  };

  const SearchIcon = props => <img src={search} alt="search" className="search_icon" onClick={props.click} />;
  const CleanSearch = props => <img src={crossRed} alt="clean_search" className="search_clean" onClick={props.click} />;

  return (
    <div className="underlinedInput">
      {text === undefined ? null : <span>{text}</span>}
      <div className="search_inp">
        <input
          id={id}
          value={value}
          type={type === undefined ? 'text' : type}
          placeholder={placeholder === undefined ? '' : placeholder}
          style={color === undefined ? {} : { borderBottomColor: color }}
          onChange={input !== undefined ? e => { input(e.target.value); } : () => { }}
        />
        {isSearch &&
          <div className="search_panel" style={color === undefined ? {} : { borderBottomColor: color }}>
            {value.length > 0 &&
              <Fragment>
                <CleanSearch click={cleanSearch} />
                <div className="divider" />
              </Fragment>
            }
            <SearchIcon click={submit} />
          </div>
        }
      </div>
    </div>
  )
}

Input.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  color: PropTypes.string,
  input: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired
  ]),
  isSearch: PropTypes.bool,
  submit: PropTypes.func,
  addForCleaning: PropTypes.func
};

export default Input
