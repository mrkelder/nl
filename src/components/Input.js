import React, { Fragment , useContext } from 'react'
import { img } from '../context'

const Input = props => {
  const { type, text, placeholder, color, input, value, isSearch, submit } = props;

  const imgContext = useContext(img);
  const { search , cross_red } = imgContext;

  const cleanSearch = () => {
    input('');
  };

  const SearchIcon = props => <img src={search} alt="search" className="search_icon" onClick={props.click} />;
  const CleanSearch = props => <img src={cross_red} alt="clean_search" className="search_clean" onClick={props.click} />;
  
  return (
    <div className="underlinedInput">
      {text === undefined ? null : <span>{text}</span>}
      <div className="search_inp">
        <input
          value={value}
          type={type === undefined ? 'text' : type}
          placeholder={placeholder === undefined ? '' : placeholder}
          style={color === undefined ? {} : { borderBottomColor: color }}
          onChange={e => { input(e.target.value); }}
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

export default Input
