import React, { useState, Fragment, useContext, useEffect } from 'react'
import RedButton from './RedButton'
import { info } from '../context'

function PageChanger({ amountOfIncoming, divideBy, currentPage, click }) {

  const { resolution } = useContext(info);
  const [pickedProperty, setPickedProperty] = useState(currentPage);
  const [difference, setDifference] = useState(0);
  const [allowedAmount, setAllowedAmount] = useState(1);
  const elementsPerShow = Math.ceil(amountOfIncoming / divideBy);
  const elementsArray = new Array(elementsPerShow).fill(1);

  useEffect(() => {
    if (resolution < 425) {
      setAllowedAmount(4);
    }
    else if (resolution >= 425 && resolution < 768) {
      setAllowedAmount(6);
    }
    else if (resolution >= 768) {
      setAllowedAmount(10);
    }
  }, [resolution]);

  useEffect(() => {
    if (pickedProperty > allowedAmount) {
      setDifference(pickedProperty - allowedAmount);
    }
    else if (pickedProperty < allowedAmount) {
      setDifference(0);
    }
  }, [pickedProperty, allowedAmount]);

  const leftArrow = () => {
    if (pickedProperty - 1 > 0) {
      click(pickedProperty - 1);
      setPickedProperty(pickedProperty - 1);
    }
  }

  const rightArrow = () => {
    if (pickedProperty + 1 < elementsArray.length + 1) {
      click(pickedProperty + 1);
      setPickedProperty(pickedProperty + 1);
    }
  }

  const changePage = e => {
    const index = Number(e.target.innerText);
    click(index);
    setPickedProperty(index);
  }

  return (
    <div className="page_changer">
      <RedButton text="<" customStyle={2} click={leftArrow} />
      {elementsArray.length > 0 &&
        <Fragment>
          {
            elementsArray.slice(0, allowedAmount).map((i, index) => <RedButton click={changePage} key={`${i}_${index}`} text={`${index + 1 + difference}`} customStyle={pickedProperty === index + 1 + difference ? 3 : 1} />)
          }
        </Fragment>
      }
      <RedButton text=">" customStyle={2} click={rightArrow} />
    </div>
  )
}

export default PageChanger
