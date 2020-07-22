import React, { Fragment, useEffect, useState } from 'react'
import SlidingPartHOC from '../components/SlidingPart'
import Slider from '../components/Slider'
import TopItems from '../components/TopItems'
import axios from 'axios'
import '../css/main.css'

const Main = () => {
  const [photosForSlider, setPhotosForSlider] = useState([]);

  const ActualSlider = SlidingPartHOC(Slider, {
    slides: photosForSlider,
  });

  useEffect(() => {
    axios.get('http://localhost:8080/getSlides')
      .then(slides => {
        setPhotosForSlider(slides.data.slides);
      })
      .catch(err => {
        console.error(err.message);
      });
  }, []);

  return (
    <Fragment>
      <ActualSlider slides={photosForSlider} />
      <TopItems />
    </Fragment>
  )
}

export default Main
