import React, { useState, useEffect, useContext } from 'react'
import SlidingPart from './SlidingPart'
import Item from './Item'
import PropTypes from 'prop-types'
import { info } from '../context'

const LatelySeen = ({ slidingPart, sliderPanelRef, currentPosition, updateHOC }) => {
  const [items, setItems] = useState([{ themes: [{ rating: 0 }] }]);
  const { resolution, domain, allInfoAboutUser } = useContext(info);

  useEffect(() => {
    if (allInfoAboutUser !== null && typeof allInfoAboutUser === 'object' && allInfoAboutUser.latelySeen.length > 0) {
      setItems(allInfoAboutUser.latelySeen);
      updateHOC();
    }
  }, [updateHOC, domain, allInfoAboutUser]);

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

LatelySeen.propTypes = {
  slidingPart: PropTypes.object,
  sliderPanelRef: PropTypes.object,
  currentPosition: PropTypes.number,
  updateHOC: PropTypes.func
};

export default SlidingPart(LatelySeen, {})
