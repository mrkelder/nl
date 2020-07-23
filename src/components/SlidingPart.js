import React, { Component } from 'react'
import { info } from '../context'


const SlidingPart = (OriginalComponent, addInfo) => {
  return class extends Component {
    constructor(props) {
      super(props);

      this.SlidingPartRef = React.createRef();
      this.SliderPanelRef = React.createRef();

      this.state = {
        currentPosition: 0, // current position of sliding element
        startPosition: 0, // starting position
        endPosition: 0, // transformed position (takes x coordinate of the final slide and then subtracts difference , actually replaces basic coordinates from 0 to some amount)
        totalSlidingWidth: 0, // total width of the sliding part
        currentPositionOnScreen: 0, // current position on a screen (from 0 to current width)
        isTouched: false, // has user touched slider at all
        isBeingTouched: false, // is slider being touched
        positionForLeave: 0, // total position for onmouseleave event
        canSlide: true // can the slider slide
      };

      this.changeCurrentPosition = this.changeCurrentPosition.bind(this);
    }

    changeCurrentPosition(x) {
      this.setState({
        currentPosition: x,
        endPosition: x
      });
    }

    componentDidMount() {
      let totalWidth = 0;
      for (let i of this.SlidingPartRef.current.children) totalWidth += i.clientWidth;
      this.setState({
        totalSlidingWidth: totalWidth - this.SlidingPartRef.current.children[0].clientWidth
      }, () => {
        // Callback
        if (this.context.resolution < 1024) {
          // If current device's width less than 1024px
          this.SliderPanelRef.current.ontouchstart = e => {
            // Touch
            this.SlidingPartRef.current.style.transition = 'none';
            this.setState({
              startPosition: Math.floor(e.changedTouches[0].clientX),
              isTouched: true,
              isBeingTouched: true
            });
          }

          this.SliderPanelRef.current.ontouchmove = e => {
            // While moving
            this.setState(oldState => ({
              currentPosition: (Math.floor(e.changedTouches[0].clientX) + oldState.endPosition) - oldState.startPosition
            }));
          }

          this.SliderPanelRef.current.ontouchend = e => {
            // Untouch
            this.SlidingPartRef.current.style.transition = 'transform .2s';
            const dif = parseInt(this.SlidingPartRef.current.style.transform.match(/-?\d{0,}px/)[0]); // difference
            if (dif > 0) {
              // In case of lest violation
              this.setState({
                currentPosition: 0,
                endPosition: 0,
                isTouched: false
              });
            }
            else if (dif < -this.state.totalSlidingWidth) {
              // In case of right violation
              this.setState(oldState => ({
                currentPosition: -oldState.totalSlidingWidth,
                endPosition: -oldState.totalSlidingWidth,
                isTouched: false
              }));
            }
            else {
              this.setState({
                endPosition: dif,
                currentPositionOnScreen: Math.floor(e.changedTouches[0].clientX),
                isTouched: false
              });
            }
          }
        }
        else {
          // If device's width is begger or equal to 1024px
          this.SliderPanelRef.current.onmouseleave = () => {
            if (this.state.isTouched && !!addInfo.isSlider) {
              this.SlidingPartRef.current.style.transition = 'transform .2s';
              this.changeCurrentPosition(this.state.positionForLeave);
              this.setState({
                canSlide: false
              });
            }
            else if (this.state.isTouched && !addInfo.isSlider) {
              this.changeCurrentPosition(this.state.currentPosition);
              this.setState({
                canSlide: false
              });
            }
          }

          this.SliderPanelRef.current.onmousedown = e => {
            // Touch
            this.SlidingPartRef.current.style.transition = 'none';
            this.setState(oldState => ({
              positionForLeave: oldState.currentPosition,
              startPosition: Math.floor(e.x),
              isTouched: true,
              isBeingTouched: true,
              canSlide: true
            }));
          }

          this.SliderPanelRef.current.onmousemove = e => {
            // While moving
            if (this.state.isTouched && this.state.canSlide) {
              this.setState(oldState => ({
                currentPosition: (Math.floor(e.x) + oldState.endPosition) - oldState.startPosition
              }));
            }
          }

          this.SliderPanelRef.current.onmouseup = e => {
            // Untouch
            this.SlidingPartRef.current.style.transition = 'transform .2s';
            const dif = parseInt(this.SlidingPartRef.current.style.transform.match(/-?\d{0,}px/)[0]); // difference
            if (dif > 0) {
              // In case of lest violation
              this.setState({
                currentPosition: 0,
                endPosition: 0,
                isTouched: false
              });
            }
            else if (dif < -this.state.totalSlidingWidth) {
              // In case of right violation
              this.setState(oldState => ({
                currentPosition: -oldState.totalSlidingWidth,
                endPosition: -oldState.totalSlidingWidth,
                isTouched: false
              }));
            }
            else {
              this.setState({
                endPosition: dif,
                currentPositionOnScreen: Math.floor(e.x),
                isTouched: false
              });
            }
          }
        }

      });
    }

    static contextType = info;

    render() {
      return (
        <OriginalComponent
          slides={addInfo.slides}
          slidingPart={this.SlidingPartRef}
          sliderPanelRef={this.SliderPanelRef}
          changeCurrentPosition={this.changeCurrentPosition}
          {...this.state}
        />
      );
    }
  }
}

export default SlidingPart