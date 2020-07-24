import React, { useState, useEffect } from 'react'
import SlidingPart from './SlidingPart'
import Item from './Item'
import axios from 'axios'

const TopItems = ({ slidingPart, sliderPanelRef, currentPosition, updateHOC }) => {
  const [items, setItems] = useState([{ themes: [{ rating: 0 }] }]);
  useEffect(() => {
    axios.get('http://localhost:8080/getTopItems').then(info => {
      setItems(info.data);
      updateHOC();
    });
  }, [updateHOC]);

  return (
    <div className="topItems" ref={sliderPanelRef}>
      <div className="topItemsSlidingPart" ref={slidingPart} style={{ transform: `translate3D(${currentPosition}px , 0 , 0)` }}>
        {
          items.map((item , index) =>
            <Item
              key={`${item._id}_${index}`}
              name={item.name}
              price={item.themes[0].price}
              rating={item.themes[0].rating}
              link={item._id}
              photo={item.themes[0].main_photo}
            />
          )
        }
      </div>
    </div>
  )
}

export default SlidingPart(TopItems, {})
