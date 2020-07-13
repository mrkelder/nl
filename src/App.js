import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Header from './components/Header'
import Main from './pages/Main'
import NotFound from './pages/404'
import { info as Info, css as CSS, img as Img } from './context'
import './css/index.css'

import cross from './img/cross.svg'
import crossWhite from './img/crossWhite.svg'
import crossRed from './img/crossRed.svg'
import catalogIcon from './img/catalog.svg'
import logo from './img/logo.svg'
import search from './img/search.svg'
import menu from './img/menu.svg'
import no_account_logo from './img/user.png'
import no_account_logo_white from './img/user_w.png'
import bin from './img/bin.png'
import house from './img/house.png'
import favorite from './img/favorite.png'
import scales from './img/scales.png'
import geo_sign from './img/location.png'
import geo_sign_white from './img/location_w.png'
import arrow_sign from './img/arrow.png'
import arrow_sign_white from './img/arrow_w.png'
import helper from './img/helper.png'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: null,
      hasError: false,
      colors: {
        white: '#FFF',
        red: '#e60000',
        grey: '#4a4d4e',
        light_grey: '#f4f4f4',
        text_grey: '#333',
        text_light_grey: '#999',
        window_bg: '#0a0a0aa1'
      },
      fonts: {
        text: 'text , Arial, Helvetica, sans-serif',
        header: 'header , Arial, Helvetica, sans-serif'
      },
      images: {
        catalogIcon,
        logo,
        arrow_sign,
        arrow_sign_white,
        helper,
        search,
        menu,
        no_account_logo,
        no_account_logo_white,
        bin,
        house,
        favorite,
        scales,
        geo_sign,
        geo_sign_white,
        crossWhite,
        cross,
        crossRed
      }
    };
    this.changeLang = this.changeLang.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem('lang') === null) {
      localStorage.setItem('lang', 'ua');
    }
    this.setState({ lang: localStorage.getItem('lang') });
    document.getElementsByTagName('html')[0].setAttribute('lang', localStorage.getItem('lang'));
  }

  changeLang() {
    if (['ua', 'ru'].includes(this.state.lang)) {
      if (this.state.lang === 'ua') {
        this.setState({ lang: 'ru' });
        document.getElementsByTagName('html')[0].setAttribute('lang', 'ru');
        localStorage.setItem('lang', 'ru');
      }
      else {
        this.setState({ lang: 'ua' });
        document.getElementsByTagName('html')[0].setAttribute('lang', 'ua');
        localStorage.setItem('lang', 'ua');
      }
    }
  }

  componentDidCatch(err) {
    console.log(err)
    this.setState({ hasError: true })
  }

  render() {
    const { lang, colors, fonts } = this.state;
    if (this.state.hasError) {
      return <p>Sorry , something went wrong. Examine an error in the console.</p>
    }
    else {
      return (
        <div className="App">
          <Info.Provider value={{
            lang,
            changeLang: this.changeLang
          }}>
            <CSS.Provider value={{
              colors,
              fonts
            }}>
              <Img.Provider value={this.state.images}>
                <Header />
                <main>
                  <Switch>
                    <Route path="/" exact component={Main} />
                    <Route path="/*" exact component={NotFound} />
                  </Switch>
                </main>
              </Img.Provider>
            </CSS.Provider>
          </Info.Provider>
        </div>
      );
    }
  }
}

export default App;
