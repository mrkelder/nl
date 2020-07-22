import React from 'react'
import SlidingPart from './SlidingPart'
import Item from './Item'

const TopItems = ({ slidingPart, sliderPanelRef, currentPosition }) => {
  return (
    <div className="topItems" ref={sliderPanelRef}>
      <div className="topItemsSlidingPart" ref={slidingPart} style={{ transform: `translate3D(${currentPosition}px , 0 , 0)` }}>

        {new Array(7).fill(7).map(() => <Item
          name="Смартфон Samsung Galaxy A50 6/128GB Black"
          price="22000"
          rating={5}
          link="/"
          photo="iPhone.png"
        />)
        }
      </div>
    </div>
  )
}

export default SlidingPart(TopItems, {})
