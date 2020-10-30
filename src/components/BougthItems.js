import React, { useState, useEffect, useContext } from 'react'
import { info } from '../context'
import TopItems from './TopItems'

const BoughtItems = () => {
  const [items, setItems] = useState([]);
  const { domain, allInfoAboutUser } = useContext(info);

  useEffect(() => {
    if (allInfoAboutUser !== null && typeof allInfoAboutUser === 'object' && allInfoAboutUser.latelySeen.length > 0) {
      setItems(allInfoAboutUser.bought);
    }
  }, [domain, allInfoAboutUser]);

  return (
    <TopItems propItems={items} />
  )
}

export default BoughtItems
