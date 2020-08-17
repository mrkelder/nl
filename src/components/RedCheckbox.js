import React, { useState } from 'react'
import checked_img from '../img/checkbox_checked.png'
import unchecked_img from '../img/checkbox.png'
// Imports images directely because it will not be used anywhere else

function RedCheckbox({ isChecked, id, value, click }) {
  const [checked, setChecked] = useState(isChecked === undefined ? false : isChecked);

  const inputChanged = () => {
    setChecked(!checked);
    click(value);
  };

  return (
    <div className="redCheckbox" >
      <img src={checked ? checked_img : unchecked_img} alt="checkbox" onClick={inputChanged} />
      <input type="checkbox" onInput={inputChanged} className="redCheckBoxInput storeFilter" id={id} value={value} />
    </div>
  );
}

export default RedCheckbox
