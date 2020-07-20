import React, { Fragment, useRef, useEffect, useState, useCallback } from 'react'
import Radio from './Radio'
import notFound from '../img/notFound.jpg'

const Slider = props => {
  const { slides, currentPosition, slidingPart, sliderPanelRef, changeCurrentPosition, currentPositionOnScreen, isTouched, isBeingTouched } = props;
  const [sliderHeight, setSliderHeight] = useState(0); // height for the slider
  const [onePiece, setOnePiece] = useState(0); // the width of one slide
  const [oneSector, setOneSector] = useState(0); // one sector of a slider
  const [currentSlide, setCurrentSlide] = useState(0); // index of the current slide
  const [componentIsReady, setComponentIsReady] = useState(false); // is component ready for updating
  const [margin, setMargin] = useState(0); // margin from the left side
  const [radios, setRadios] = useState([]); // radio buttons

  const imgRef = useRef(null);

  const becomeChecked = useCallback(index => {
    setCurrentSlide(index);
    changeCurrentPosition(-1 * index * onePiece);
  }, [changeCurrentPosition, onePiece]);

  const SliderHeight = useCallback(() => {
    setSliderHeight(imgRef.current.height);
    setMargin(Math.floor((document.getElementsByTagName('body')[0].clientWidth - imgRef.current.clientWidth) / 2));
  }, []);

  useEffect(() => {
    setComponentIsReady(true);
  }, [props]);

  useEffect(() => {
    setRadios(slides.map((element, index) => (
      <Radio click={becomeChecked} isCehcked={currentSlide === index ? true : false} name="slider_radio" id={`radio_slider_${index}`} key={`radio_slider_${index}`} index={index} />
    )));
  }, [slides, becomeChecked, currentSlide]);

  useEffect(() => {
    if (slidingPart.current !== null) {
      setOnePiece(slidingPart.current.children[0].clientWidth);
      setOneSector(onePiece / 4);
    }
  }, [slidingPart, onePiece]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (imgRef.current !== null) SliderHeight();
      if (slidingPart.current !== null) {
        setOnePiece(slidingPart.current.children[0].clientWidth);
        setOneSector(onePiece / 4);
      }
    });
  }, [imgRef, SliderHeight, onePiece, slidingPart]);

  useEffect(() => {
    if (!isTouched && isBeingTouched && componentIsReady && ![0, 1].includes(slides.length)) {
      switch (true) {
        case currentPositionOnScreen <= oneSector * 1 + margin:
          if (currentSlide !== slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
            changeCurrentPosition(-1 * onePiece * (currentSlide + 1));
          }
          break;
        case (currentPositionOnScreen <= oneSector * 2 + margin) || (currentPositionOnScreen <= oneSector * 3 + margin):
          changeCurrentPosition(currentSlide * -1 * onePiece);
          break;
        case currentPositionOnScreen <= oneSector * 4 + margin:
          if (currentSlide !== 0) {
            setCurrentSlide(currentSlide - 1);
            changeCurrentPosition(-1 * onePiece * (currentSlide - 1));
          }
          break;
        default: break;
      }
      setComponentIsReady(false);
    }
  }, [currentPositionOnScreen, margin, oneSector, currentSlide, slides.length, isTouched, onePiece, changeCurrentPosition, isBeingTouched]);

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
        <div className="slider_radio_panel">
          {radios}
        </div>
      </div>
    </div>
  )
}

export default Slider
