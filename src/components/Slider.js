import React, { Fragment, Component, useRef, useEffect, useState, useCallback } from 'react'
import notFound from '../img/notFound.jpg'

// class Slider extends Component {
//   constructor(props) {
//     super(props);

//     this.imgRef = React.createRef();

//     this.state = {
//       sliderHeight: 0,
//       onePiece: 0,
//       oneSector: 0,
//       currentSlide: 0,
//       componentIsReady: false
//     };

//     this.sliderHeight = this.sliderHeight.bind(this);
//   }

//   componentDidMount() {
//     if (this.props.slidingPart.current !== null) {
//       // Sets onePiece and oneSector
//       this.setState({
//         onePiece: this.props.slidingPart.current.children[0].clientWidth
//       }, () => {
//         this.setState(oldState => ({ oneSector: oldState.onePiece / 4 }));
//       });
//     }

//     window.addEventListener('resize', () => {
//       // Resize event
//       if (this.imgRef.current !== null) {
//         this.setState({
//           sliderHeight: this.imgRef.current.height
//         });
//       }
//       if (this.props.slidingPart.current !== null) {
//         // Resets onePiece and oneSector
//         this.setState({
//           onePiece: this.props.slidingPart.current.children[0].clientWidth
//         }, () => {
//           this.setState(oldState => ({ oneSector: oldState.onePiece / 4 }));
//         });
//       }
//     });

//     this.setState({
//       componentIsReady: true
//     });
//   }

//   componentDidUpdate() {
//     switch (true) {
//       case this.props.currentPositionOnScreen <= 1 * this.state.oneSector:
//         // this.props.changeCurrentPosition(-1 * this.props.currentPositionOnScreen * this.state.oneSector);
//         console.log(1, -1 * this.state.currentSLide + 1)
//         break;
//       case this.props.currentPositionOnScreen <= 3 * this.state.oneSector:
//         console.log(2, -this.state.currentSLide)
//         break;
//       case this.props.currentPositionOnScreen <= 4 * this.state.oneSector:
//         console.log(1, -this.state  .currentSLide - 1)
//         break;
//     }
//   }

//   componentWillUnmount() {
//     this.setState({
//       componentIsReady: false
//     });
//   }

//   sliderHeight() {
//     // Changes slider's height depending on the slides
//     this.setState({
//       sliderHeight: this.imgRef.current.height
//     })
//   }

//   render() {
//     return (
//       <div className="slider" style={{ height: `${this.state.sliderHeight}px` }}>
//         <div className="sliding_part" style={{ transform: `translate3D(${this.props.currentPosition}px , 0 , 0)` }} ref={this.props.slidingPart}>
//           {this.props.slides.length === 0 ?
//             <picture>
//               <source srcSet={notFound} draggble="false" />
//               <img className="img_for_slider" src={notFound} alt="not_found" onLoad={this.sliderHeight} ref={this.imgRef} />
//             </picture>
//             :
//             <Fragment>
//               {this.props.slides.map((element, index) => (
//                 <picture key={`slide_${index}`}>
//                   <source media="(max-width: 1023px)" srcSet={`http://localhost:8080/${element.mobile}`} />
//                   <source srcSet={`http://localhost:8080/${element.pc}`} draggble="false" />
//                   <img className="img_for_slider" src={notFound} alt="not_found" onLoad={this.sliderHeight} ref={this.imgRef} />
//                 </picture>
//               ))}
//             </Fragment>
//           }
//         </div>
//         <div className="slider_panel" style={{ height: `${this.state.sliderHeight}px` }} ref={this.props.sliderPanelRef}>

//         </div>
//       </div>
//     );
//   }

// }

const Slider = props => {
  const { slides, currentPosition, slidingPart, sliderPanelRef, changeCurrentPosition, currentPositionOnScreen, isTouched, isBeingTouched } = props;
  const [sliderHeight, setSliderHeight] = useState(0); // height for the slider
  const [onePiece, setOnePiece] = useState(0); // the width of one slide
  const [oneSector, setOneSector] = useState(0); // one sector of a slider
  const [currentSlide, setCurrentSlide] = useState(0); // index of the current slide
  const [componentIsReady, setComponentIsReady] = useState(false); // is component ready for updating

  const imgRef = useRef(null);

  const SliderHeight = useCallback(() => {
    setSliderHeight(imgRef.current.height);
  }, []);

  useEffect(() => {
    setComponentIsReady(true);
  }, [props]);

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
    if (!isTouched && isBeingTouched && componentIsReady) {
      switch (true) {
        case currentPositionOnScreen <= oneSector * 1:
          if (currentSlide !== slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
            changeCurrentPosition(-1 * onePiece * (currentSlide + 1));
          }
          break;
        case (currentPositionOnScreen <= oneSector * 2) || (currentPositionOnScreen <= oneSector * 3):
          changeCurrentPosition(currentSlide * -1 * onePiece);
          break;
        case currentPositionOnScreen <= oneSector * 4:
          if (currentSlide !== 0) {
            setCurrentSlide(currentSlide - 1);
            changeCurrentPosition(-1 * onePiece * (currentSlide - 1));
          }
          break;
      }
      setComponentIsReady(false);
    }
  }, [currentPositionOnScreen, oneSector, currentSlide, slides.length, isTouched, onePiece, changeCurrentPosition, isBeingTouched]);

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
