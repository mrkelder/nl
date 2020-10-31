import React, { useState, useEffect, useContext } from 'react'
import { info } from '../context'
import TopItems from './TopItems'

const LatelySeen = () => {
  const [items, setItems] = useState([]);
  const { domain, allInfoAboutUser } = useContext(info);

  useEffect(() => {
    if (allInfoAboutUser !== null && typeof allInfoAboutUser === 'object' && allInfoAboutUser.latelySeen.length > 0) {
      setItems(allInfoAboutUser.latelySeen);
    }
  }, [domain, allInfoAboutUser]);

  return (
    <TopItems propItems={items} />
  )
}

export default LatelySeen
