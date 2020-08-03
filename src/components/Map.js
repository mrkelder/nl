import React, { Fragment, useContext, useState, useEffect, useCallback } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'
import Shop from './Shop'

import { info, css } from '../context'
import axios from 'axios'

function MapContainer(props) {
  const { lang, resolution } = useContext(info);
  const { text } = useContext(css).fonts;
  const [cities, setCities] = useState([]);
  const [cityIndex, setCityIndex] = useState(0);
  const [shopIndex, setShopIndex] = useState(0);
  const [focusPoint, setFocusPoint] = useState({ lat: 0, lng: 0 });
  const [points, setPoints] = useState([{ lat: 0, lng: 0 }]);

  const changeCity = e => {
    // Changes city (select , option)
    const id = e.target.value;
    const foundResult = cities.findIndex(i => i._id === id);
    setCityIndex(foundResult);
    updatePoints(cities[foundResult].shops)
  }

  const changeShopIndex = (index, shops) => {
    // Changes a focused shop
    setShopIndex(index);
    setFocusPoint(shops[index]);
  };

  const updatePoints = useCallback(shops => {
    // Updates the points (shops) in the map
    let readyPoints = [];
    for (let i of shops) readyPoints.push({ lat: i.location.coordinates[0], lng: i.location.coordinates[1] });
    setPoints(readyPoints);
    changeShopIndex(0, readyPoints);
  }, []);

  const clickEventForShop = e => {
    // Changes index (for Shop.js components)
    const elementId = e.target.getAttribute('data-id');
    const id = cities[cityIndex].shops.findIndex(i => i._id === elementId);
    changeShopIndex(id, points);
  };

  const GoogleMap = subProps => (
    <Map
      google={props.google}
      zoom={14}
      style={{
        width: '100%',
        height: '100%'
      }}
      initialCenter={subProps.focusPoint}
    >
      {
        subProps.points.map((i, index) => <Marker key={`marker_${index}`} position={{ lat: i.lat, lng: i.lng }} />)
      }
    </Map>
  );

  useEffect(() => {
    // Fetching shops for map
    axios.get('http://localhost:8080/getShops')
      .then(cities => {
        setCities(cities.data);
        updatePoints(cities.data[0].shops);
      })
      .catch(err => {
        console.error(err.message);
      });
  }, [updatePoints]);

  return (
    <Fragment>
      {resolution >= 1024 &&
        <div id="map">
          <div id="available_shops">
            <h2 style={{ fontFamily: text }}>{lang === 'ua' ? 'Магазини' : 'Магазины'}</h2>
            <hr id="map_hr" />
            {
              cities.length !== 0 &&
              <Fragment>
                <select value={cities[cityIndex]._id} onChange={changeCity}>
                  {
                    cities.map(element => <option value={element._id} key={element._id}>{element.name[lang]}</option>)
                  }
                </select>
              </Fragment>
            }
            {cities.length > 0 &&
              <Fragment>
                {
                  cities[cityIndex].shops.map((i, index) => {
                    let isChecked = false;
                    if (index === shopIndex) {
                      isChecked = !isChecked;
                    }
                    return <Shop
                      key={i._id}
                      click={clickEventForShop}
                      id={i._id}
                      name={i.name}
                      days={i.work_time}
                      isChecked={isChecked}
                    />;
                  })
                }
              </Fragment>
            }
          </div>
          <div id="google_map">
            <GoogleMap focusPoint={focusPoint} points={points} />
          </div>
        </div>
      }
    </Fragment>
  )
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API
})(MapContainer)