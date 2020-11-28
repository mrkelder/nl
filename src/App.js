import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Header from './components/Header'
import Main from './pages/Main'
import ItemPage from './pages/ItemPage'
import Store from './pages/Store'
import Footer from './components/Footer'
import NotFound from './components/404'
import Account from './pages/Account'
import Bin from './pages/Bin'
import { info as Info, css as CSS, img as Img } from './context'
import './css/index.css'
import axios from 'axios'

import settings from './img/settings.png'
import filter from './img/filter.png'
import notFound from './img/notFound.jpg'
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
import radio from './img/radio.png'
import radio_checked from './img/radio_checked.png'
import star from './img/star.png'
import star_active from './img/star_active.png'
import truck from './img/truck.png'
import like from './img/like.png'
import checked from './img/checked.png'
import fb from './img/fb.png'
import yt from './img/yt.png'
import insta from './img/insta.png'
import tw from './img/tw.png'
import visa from './img/visa.png'
import mc from './img/mc.png'
import vvmc from './img/vvmc.svg'
import trippleDots from './img/trippleDots.png'
import pageNotFoundFace from './img/404.png'
import loading from './img/loading.gif'
import binChecked from './img/binChecked.png'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: null,
      hasError: false,
      domain: 'localhost:8080',  // must be localhost:8080 by default
      resolution: document.getElementsByTagName('body')[0].clientWidth,
      user: {},
      allInfoAboutUser: {},
      bin: [],
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
        binChecked,
        pageNotFoundFace,
        trippleDots,
        catalogIcon,
        logo,
        arrow_sign,
        loading,
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
        crossRed,
        radio,
        radio_checked,
        star_active,
        star,
        truck,
        checked,
        like,
        fb,
        yt,
        tw,
        insta,
        visa,
        mc,
        vvmc,
        notFound,
        filter,
        settings
      }
    };
    this.changeLang = this.changeLang.bind(this);
    this.changeResolution = this.changeResolution.bind(this);
    this.lookForUserExistence = this.lookForUserExistence.bind(this);
    this.changeUserObject = this.changeUserObject.bind(this);
    this.changeAllInfoAboutUser = this.changeAllInfoAboutUser.bind(this);
    this.addItemToBin = this.addItemToBin.bind(this);
    this.removeItemFromBin = this.removeItemFromBin.bind(this);
    this.cleanBin = this.cleanBin.bind(this);
  }

  async componentDidMount() {
    window.addEventListener('resize', () => {
      this.changeResolution(document.getElementsByTagName('body')[0].clientWidth);
    });

    if (localStorage.getItem('lang') === null) {
      localStorage.setItem('lang', 'ua');
    }

    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      const { email, pass } = user;
      const { data } = await axios.post(`http://${this.state.domain}/getUser`, { email, password: pass });
      this.setState({ allInfoAboutUser: data, bin: data.bin });
    }

    this.setState({ lang: localStorage.getItem('lang') });
    this.setState({ user: JSON.parse(localStorage.getItem('user')) });
    document.getElementsByTagName('html')[0].setAttribute('lang', localStorage.getItem('lang'));
  }

  addItemToBin(item) {
    console.log(item)
    this.setState(({ bin }) => {
      if (bin.findIndex(element => element._id === item._id) === -1) {
        axios.post(`http://${this.state.domain}/getBinItem`, { productId: item._id, email: this.state.user.email, password: this.state.user.pass });
        bin.push(item);
        return { bin };
      }
    });
  }

  removeItemFromBin(id) {
    this.setState(({ bin }) => {
      axios.post(`http://${this.state.domain}/removeBinItem`, { productId: id, email: this.state.user.email, password: this.state.user.pass });
      const newBin = bin.filter(i => i._id !== id);
      return { bin: newBin };
    })
  }

  changeResolution() {
    this.setState({
      resolution: document.getElementsByTagName('body')[0].clientWidth
    });
  }

  changeUserObject() {
    this.setState({ user: JSON.parse(localStorage.getItem('user')) });
  }

  changeAllInfoAboutUser(info) {
    this.setState({ allInfoAboutUser: info });
  }

  async cleanBin() {
    this.setState({
      bin: []
    });
    await axios.post(`http://${this.state.domain}/cleanBin`);
  }

  async lookForUserExistence() {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      const { email, pass } = user;
      const { data } = await axios.post(`http://${this.state.domain}/getUser`, { email, password: pass });
      this.setState({ allInfoAboutUser: data });
    }
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
    console.error(err);
    this.setState({ hasError: true });
  }

  render() {
    const { lang, colors, fonts, resolution, domain, user, allInfoAboutUser, bin } = this.state;
    if (this.state.hasError) {
      return <p>Sorry , something went wrong. Examine an error in the console.</p>;
    }
    else {
      return (
        <div className="App">
          <Info.Provider value={{
            lang,
            changeLang: this.changeLang,
            resolution,
            domain,
            user,
            allInfoAboutUser,
            payPalClientId: 'Aag1-0V8S2yhNI1fQ1WT6kgCw65XiNYZTeo_wGnynba03RNdCjRv9RpPz6mO5qU3DWUjtWn2wcIHVVDk',
            lookForUserExistence: this.lookForUserExistence,
            changeUserObject: this.changeUserObject,
            changeAllInfoAboutUser: this.changeAllInfoAboutUser,
            addItemToBin: this.addItemToBin,
            bin,
            removeItemFromBin: this.removeItemFromBin
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
                    <Route path="/account" exact component={Account} />
                    <Route path="/shop" exact render={() => <Redirect to="/" />} />
                    <Route path="/shop/:category" exact render={props =>
                      <CSS.Consumer>
                        {cssContext =>
                          <Info.Consumer>
                            {infoContext =>
                              <Img.Consumer>
                                {imgContext => <Store img={imgContext} info={infoContext} css={cssContext} {...props} />}
                              </Img.Consumer>}
                          </Info.Consumer>
                        }
                      </CSS.Consumer>
                    } />
                    <Route path="/bin" component={Bin} />
                    <Route exact path="/item/:itemId" render={props => <ItemPage {...props} />} />
                    <Route path="/*" exact render={() => <NotFound errorMessage={{ ua: 'Вибачте, але ми не змогли знайти таку сторінку', ru: 'Простите , но мы не смогли найти такую страницу' }} />} />
                  </Switch>
                </main>
                <Footer />
              </Img.Provider>
            </CSS.Provider>
          </Info.Provider>
        </div>
      );
    }
  }
}

export default App;
