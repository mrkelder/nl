import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Grey_bg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      style: {}
    };
  }

  componentDidMount() {
    const AppDiv = document.getElementsByClassName('App')[0];
    AppDiv.style.overflow = 'hidden';
    AppDiv.style.height = '100vh';

    if (typeof this.props.style === 'object') this.setState({ style: this.props.style });
  }

  componentWillUnmount() {
    const AppDiv = document.getElementsByClassName('App')[0];
    AppDiv.style.overflow = 'visible';
    AppDiv.style.height = 'auto';
  }

  render() {
    return ReactDOM.createPortal(
      <div className="greyBG" onClick={this.props.click} style={this.state.style}>{this.props.children}</div>,
      document.getElementById('portal')
    )
  }
}

Grey_bg.propTypes = {
  style: PropTypes.object,
  children: PropTypes.element,
  click: PropTypes.func
}

export default Grey_bg
