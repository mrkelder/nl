import React, { Component } from 'react'


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
        totalSlidingWidth: 0 // total width of the sliding part
      };
    }

    componentDidMount() {
      let totalWidth = 0;
      for (let i of this.SlidingPartRef.current.children) totalWidth += i.clientWidth;
      this.setState({
        totalSlidingWidth: totalWidth - this.SlidingPartRef.current.children[0].clientWidth
      }, () => {
        // Callback
        this.SliderPanelRef.current.ontouchstart = e => {
          // Touch
          this.SlidingPartRef.current.style.transition = 'none';
          this.setState({
            startPosition: Math.floor(e.changedTouches[0].clientX)
          });
        }

        this.SliderPanelRef.current.ontouchmove = e => {
          // While moving
          this.setState(oldState => ({
            currentPosition: (Math.floor(e.changedTouches[0].clientX) + oldState.endPosition) - oldState.startPosition
          }));
        }

        this.SliderPanelRef.current.ontouchend = () => {
          // Untouch
          this.SlidingPartRef.current.style.transition = 'transform .2s';
          const dif = parseInt(this.SlidingPartRef.current.style.transform.match(/-?\d{0,}px/)[0]); // difference
          if (dif > 0) {
            // In case of lest violation
            this.setState({
              currentPosition: 0,
              endPosition: 0
            });
          }
          else if (dif < -this.state.totalSlidingWidth) {
            // In case of right violation
            this.setState(oldState => ({
              currentPosition: -oldState.totalSlidingWidth,
              endPosition: -oldState.totalSlidingWidth
            }));
          }
          else {
            this.setState({
              endPosition: dif
            });
          }
        }
      });
    }

    render() {
      return (
        <OriginalComponent
          slides={addInfo.slides}
          slidingPart={this.SlidingPartRef}
          sliderPanelRef={this.SliderPanelRef}
          {...this.state}
        />
      );
    }
  }
}

export default SlidingPart