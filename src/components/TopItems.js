import React, { useState, useEffect, useContext } from 'react'
import SlidingPart from './SlidingPart'
import Item from './Item'
import axios from 'axios'
import PropTypes from 'prop-types'
import { info } from '../context'

const TopItems = ({ slidingPart, sliderPanelRef, currentPosition, updateHOC }) => {
  const [items, setItems] = useState([{ themes: [{ rating: 0 }] }]);
  const { resolution, domain } = useContext(info);
  useEffect(() => {
    axios.get(`http://${domain}/getTopItems`).then(info => {
      setItems(info.data);
      updateHOC();
    });
  }, [updateHOC , domain]);

  return (
    <div className="topItems" ref={sliderPanelRef}>
      <div className="topItemsSlidingPart" ref={slidingPart} style={{ transform: `translate3D(${currentPosition}px , 0 , 0)` }}>
        {
          items.map((item, index) =>
            <Item
              key={`${item._id}_${index}`}
              name={item.name}
              price={item.themes[0].price}
              rating={item.themes[0].rating}
              link={item._id}
              style={resolution < 1024 ? 1 : 2}
              photo={item.themes[0].main_photo}
            />
          )
        }
      </div>
    </div>
  )
}

TopItems.propTypes = {
  slidingPart: PropTypes.object,
  sliderPanelRef: PropTypes.object,
  currentPosition: PropTypes.number,
  updateHOC: PropTypes.func
};

export default SlidingPart(TopItems, {})
