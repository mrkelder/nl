import React, { useState, useEffect, useContext } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Item from './Item'
import axios from 'axios'
import { info } from '../context'

const SlidingPartOfTopItems = ({ allowedAmountOfItems, items, resolution }) => <Swiper
  className="topItems"
  slidesPerView={allowedAmountOfItems}
>
  {items.length > 0 &&
    items.map((item, index) =>
      <SwiperSlide key={`${item._id}_${index}`} className="swiperSlide">
        <Item
          name={item.name}
          price={item.themes[0].price}
          rating={item.themes[0].rating}
          link={item._id}
          style={resolution < 1024 ? 1 : 2}
          photo={item.themes[0].main_photo}
        />
      </SwiperSlide>
    )
  }
</Swiper>;

const TopItems = ({ propItems }) => {
  const [items, setItems] = useState([]);
  const [allowedAmountOfItems, setAllowedAmountOfItems] = useState(1);
  const { resolution, domain } = useContext(info);

  useEffect(() => {
    switch (true) {
      case resolution === 320: setAllowedAmountOfItems(1); break;
      case resolution >= 700 && resolution < 996: setAllowedAmountOfItems(2); break;
      case resolution >= 996 && resolution < 1024: setAllowedAmountOfItems(3); break;
      case resolution >= 1024 && resolution < 1200: setAllowedAmountOfItems(4); break;
      case resolution >= 1200 && resolution < 1440: setAllowedAmountOfItems(5); break;
      case resolution >= 1440 && resolution < 2000: setAllowedAmountOfItems(6); break;
      case resolution >= 2000: setAllowedAmountOfItems(7); break;
      default: setAllowedAmountOfItems(1); break;
    }
  }, [resolution]);

  useEffect(() => {
    if (!propItems) {
      axios.get(`http://${domain}/getTopItems`).then(info => {
        setItems(info.data);
      });
    }
    else {
      setItems(propItems);
    }
  }, [domain, propItems]);

  return (
    <SlidingPartOfTopItems allowedAmountOfItems={allowedAmountOfItems} items={items} resolution={resolution} />
  )
}


export default TopItems
