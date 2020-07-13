import React, { useEffect, Fragment, useState, useCallback, useRef } from 'react'
import notFound from '../img/notFound.jpg'

const Slider = props => {
  const { slides, currentPosition, slidingPart, sliderPanelRef } = props;
  const [sliderHeight, setSliderHeight] = useState(0); // height for the slider

  const imgRef = useRef(null);

  const SliderHeight = useCallback(() => {
    setSliderHeight(imgRef.current.height);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (imgRef.current !== null) SliderHeight();
    });
  }, [imgRef, SliderHeight]);

  return (
    <div className="slider" style={{ height: `${sliderHeight}px` }}>
      <div className="sliding_part" style={{ transform: `translate3D(${currentPosition}px , 0 , 0)` }} ref={slidingPart}>
        {slides.length === 0 ?
          <picture>
            <source srcSet={notFound} draggble="false" />
            <img className="img_for_slider" src={notFound} alt="not_found" onLoad={SliderHeight} ref={imgRef} />
          </picture>
          :
          <Fragment>
            {slides.map((element, index) => (
              <picture key={`slide_${index}`}>
                <source media="(max-width: 1023px)" srcSet={`http://localhost:8080/${element.mobile}`} />
                <source srcSet={`http://localhost:8080/${element.pc}`} draggble="false" />
                <img className="img_for_slider" src={notFound} alt="not_found" onLoad={SliderHeight} ref={imgRef} />
              </picture>
            ))}
          </Fragment>
        }
      </div>
      <div className="slider_panel" style={{ height: `${sliderHeight}px` }} ref={sliderPanelRef}>

      </div>
    </div>
  )
}

export default Slider
