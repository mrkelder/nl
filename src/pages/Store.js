import React, { Fragment, Component } from 'react'
import RedButton from '../components/RedButton'
import GreyBG from '../components/GreyBG'
import FadeButton from '../components/FadeButton'
import RedCheckbox from '../components/RedCheckbox'
import CloseBtn from '../components/CloseBtn'
import Input from '../components/Input'
import Item from '../components/Item'
import NotFound from '../components/404'
import PageChanger from '../components/PageChanger'
import axios from 'axios'

import store1 from '../img/store1.png'
import store1_a from '../img/store1_a.png'
import store2 from '../img/store2.png'
import store2_a from '../img/store2_a.png'
import store3 from '../img/store3.png'
import store3_a from '../img/store3_a.png'
import { Link } from 'react-router-dom'
import '../css/store.css'
import { info } from '../context'

class Store extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canBeShown: true,
      isSlideStorePanel: false,
      companies: [],
      nameOfCategory: '',
      minPrice: 0,
      maxPrice: 999999,
      pickedCompanies: [],
      propCategory: '',
      amountOfIncoming: 10,
      readyItems: [],
      properties: [],
      addedProperties: [],
      storeItemSize: 2,
      listSequence: 1,
      amountOfWholeCatalog: 0,
      indexOfCurrentPage: 1
    };

    this.pickMaxPrice = this.pickMaxPrice.bind(this);
    this.pickMinPrice = this.pickMinPrice.bind(this);
    this.openSideFilter = this.openSideFilter.bind(this);
    this.pickCompany = this.pickCompany.bind(this);
    this.updateNameOfCategory = this.updatePage.bind(this);
    this.addProperty = this.addProperty.bind(this);
    this.changeSequenceOfList = this.changeSequenceOfList.bind(this);
    this.cahngeStoreItemSize = this.cahngeStoreItemSize.bind(this);
    this.doesPropertyExist = this.doesPropertyExist.bind(this);
    this.changePriceCategory = this.changePriceCategory.bind(this);
    this.remakeItems = this.remakeItems.bind(this);
    this.changePageViaPanel = this.changePageViaPanel.bind(this);
  }

  static contextType = info;

  componentDidUpdate() {
    const propCategory = this.props.match.params.category;
    if (this.state.propCategory !== propCategory) {
      this.updatePage(propCategory);
    }
  }

  async componentDidMount() {
    const propCategory = this.props.match.params.category;
    const query = this.props.location.search.match(/[\w\d]+/ig);

    const availableCompanies = await (await axios.get(`http://${this.context.domain}/getCompaniesForStore`, { params: { category: propCategory } })).data;

    const allCompanies = availableCompanies.map(i => i._id);

    if (query !== null && allCompanies.includes(query[1])) this.setState({ pickedCompanies: [query[1]] }, () => { this.updatePage(propCategory) });
    else this.updatePage(propCategory);

  }

  changeSequenceOfList(e) {
    this.setState({
      listSequence: Number(e.target.value)
    }, () => {
      this.remakeItems();
    });
  }

  cahngeStoreItemSize(e) {
    this.setState({
      storeItemSize: Number(e.target.getAttribute('data-size'))
    })
  }

  async remakeItems() {
    const { maxPrice, minPrice, addedProperties, pickedCompanies, listSequence } = this.state;
    const allItems = await axios.get('http://localhost:8080/getItems', { params: { itemsCategory: this.state.propCategory } });
    const newItems = await axios.get('http://localhost:8080/getItems', { params: { itemsCategory: this.state.propCategory, extraInfo: { properties: addedProperties, maxPrice, minPrice, pickedCompanies, sequence: listSequence } } });

    this.setState({
      readyItems: newItems.data.length === 0 ? (this.state.addedProperties.length === 0 ? allItems.data : []) : newItems.data.slice((this.state.amountOfIncoming * this.state.indexOfCurrentPage) - this.state.amountOfIncoming, this.state.amountOfIncoming * this.state.indexOfCurrentPage),
      amountOfWholeCatalog: newItems.data.length
    });
  }

  changePageViaPanel(index) {
    this.setState({
      indexOfCurrentPage: index
    }, () => {
      const propCategory = this.props.match.params.category;
      this.updatePage(propCategory);
    });
  }

  doesPropertyExist(property, original) {
    let canBePicked = false;
    for (let i of original) {
      if (i.name === property.name && i.value === property.value) {
        // If objects are the same
        canBePicked = true;
        break;
      }
      if ((i.name !== property.name && i.value !== property.value)
        || (i.name === property.name && i.value !== property.value)
        || (i.name !== property.name && i.value === property.value)) {
        // If objects are different
        canBePicked = false;
      }
    }
    return canBePicked;
  }

  addProperty(property) {
    this.setState(oldState => {
      const arr = oldState.addedProperties;
      let canBeAdded = false; // Does this.state.properties contain such property

      if (arr.length === 0) {
        // If added properties are completely empty
        canBeAdded = true;
      }
      else {
        // Deduce whether to remove or to push the property to the state
        for (let i of arr) {
          if (i.name === property.name && i.value === property.value) {
            // If objects are the same
            canBeAdded = false;
            break;
          }
          if ((i.name !== property.name && i.value !== property.value)
            || (i.name === property.name && i.value !== property.value)
            || (i.name !== property.name && i.value === property.value)) {
            // If objects are different
            canBeAdded = true;
          }
        }
      }

      if (canBeAdded) {
        // Adds this property
        arr.push(property);
        return { addedProperties: arr };
      }
      else {
        // Removes this property
        const index = arr.findIndex(i => i.name === property.name && i.value === property.value);
        arr.splice(index, 1);
        return { addedProperties: arr };
      }
    }, () => {
      this.remakeItems();
    });
  }

  updatePage(propCategory) {
    this.setState({ propCategory }, () => {
      axios.get('http://localhost:8080/getCatalog').then(({ data }) => {
        // Retrieves catalog
        let items = [];
        for (let item of data) {
          for (let i of item.items) {
            // Making a list of the all available links
            if (i.link === `/${propCategory}`) {
              this.setState({
                nameOfCategory: i.name[this.props.info.lang]
              });
            }
            items.push(i.link);
          }
        }
        // Compares the actual link with the available ones
        if (!items.includes(`/${propCategory}`)) this.setState({ canBeShown: false });
        else this.setState({ canBeShown: true });
        axios.get('http://localhost:8080/getCompaniesForStore', { params: { category: propCategory } })
          .then(info => {
            // Retrieves companies
            this.setState({ companies: info.data });
            let readyPromise;
            if (this.state.pickedCompanies.length > 0) readyPromise = axios.get('http://localhost:8080/getItems', { params: { itemsCategory: propCategory, amountOfIncoming: this.state.amountOfIncoming * this.state.indexOfCurrentPage, extraInfo: { pickedCompanies: this.state.pickedCompanies , status: 1 } } });
            else readyPromise = axios.get('http://localhost:8080/getItems', { params: { itemsCategory: propCategory, amountOfIncoming: this.state.amountOfIncoming * this.state.indexOfCurrentPage } });
            readyPromise.then(({ data }) => {
              // Sorts items for showing (e.g. this is third page of items we show the range from 20 to 30 items)
              const readyItems = data.slice((this.state.amountOfIncoming * this.state.indexOfCurrentPage) - this.state.amountOfIncoming, this.state.amountOfIncoming * this.state.indexOfCurrentPage);
              this.setState({
                readyItems
              }, () => {
                axios.get('http://localhost:8080/getProperties', { params: { category: propCategory } })
                  .then(({ data }) => {
                    this.setState({ properties: data });
                    axios.get('http://localhost:8080/getItems', { params: { itemsCategory: propCategory, amountOfIncoming: 0 } })
                      .then(({ data }) => {
                        this.setState({
                          amountOfWholeCatalog: data.length
                        });
                      });
                  });
              });
            });
          });
      });
    });
  }

  pickCompany(value) {
    // Picks out the companies for the filter
    this.setState(oldState => {
      const arr = oldState.pickedCompanies;
      if (arr.includes(value)) {
        arr.splice(arr.indexOf(value), 1);
      }
      else {
        arr.push(value);
      }
      return ({ pickedCompanies: arr });
    }, () => {
      this.remakeItems();
    });
  }

  openSideFilter() {
    // Opens side filter
    this.setState(oldState => ({
      isSlideStorePanel: !oldState.isSlideStorePanel
    }));
  }

  pickMaxPrice(value) {
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      if (Number(value) <= Number(this.state.minPrice)) {
        // If the price is lover or eqaul to the lowest price range then make it higher
        this.setState({
          maxPrice: Number(this.state.minPrice) + 1
        }, this.changePriceCategory);
      }
      else {
        this.setState({
          maxPrice: Number(value)
        }, this.changePriceCategory);
      }
    }
  }

  pickMinPrice(value) {
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      if (/0\d+/.test(document.getElementById('minPrice').value)) {
        // If the price input contains something like "03" then remake it into "3"
        document.getElementById('minPrice').value = Number(value);
      }
      if (Number(value) >= Number(this.state.maxPrice)) {
        // If the price is higher or eqaul to the highest price range then make it lower
        this.setState({
          minPrice: Number(this.state.maxPrice) - 1
        }, this.changePriceCategory);
      }
      else {
        this.setState({
          minPrice: Number(value)
        }, this.changePriceCategory);
      }
    }
  }

  changePriceCategory() {
    this.remakeItems();
  }

  render() {
    if (this.state.canBeShown) {
      return (
        <div id="store">
          <div id="bread_crumbs">
            {this.props.info.resolution < 1024 &&
              <Link to="/">{this.props.info.lang === 'ua' ? '< Інтернет-магазин New London' : '< Интернет-магазин New London'}</Link>
            }
            {this.props.info.resolution >= 1024 &&
              <Fragment>
                <Link to="/">{this.props.info.lang === 'ua' ? 'Інтернет-магазин New London' : 'Интернет-магазин New London'}</Link>
                <img src={this.props.img.arrow_sign} alt="arrow_sign" className="arrow" />
                <Link to={this.props.location.pathname}>{this.state.nameOfCategory}</Link>
              </Fragment>
            }
          </div>
          {this.props.info.resolution < 1024 &&
            <div id="filter">
              <h1>{this.state.nameOfCategory}</h1>
              <RedButton text={this.props.info.lang === 'ua' ? 'Фiльтр' : 'Фильтр'} click={this.openSideFilter} />
              {this.state.isSlideStorePanel &&
                <GreyBG>
                  <div id="side_filter">
                    <div id="store_heading">
                      <CloseBtn click={this.openSideFilter} />
                      <img src={this.props.img.filter} alt="filter" />
                      <h3>{this.props.info.lang === 'ua' ? 'Фiльтр' : 'Фильтр'}</h3>
                    </div>
                    {this.state.companies.length > 0 &&
                      <FadeButton text="Бренд">
                        <div id="brands">
                          {
                            this.state.companies.map(i =>
                              <div key={i._id} className="brand">
                                <RedCheckbox isChecked={this.state.pickedCompanies.includes(i._id) ? true : false} id={`brands_${i._id}`} value={i._id} click={this.pickCompany} />
                                <label htmlFor={`brands_${i._id}`} >
                                  <span>{i.name}</span>
                                </label>
                              </div>
                            )
                          }
                        </div>
                      </FadeButton>
                    }
                    <FadeButton text={this.props.info.lang === 'ua' ? 'Цiна' : 'Цена'}>
                      <div id="store_prices">
                        <div id="store_price_inputs">
                          <Input value={this.state.minPrice} type="number" input={this.pickMinPrice} id="minPrice" />
                          <hr />
                          <Input value={this.state.maxPrice} type="number" input={this.pickMaxPrice} id="maxPrice" />
                          <span>грн</span>
                        </div>
                      </div>
                    </FadeButton>
                    {this.state.properties.length > 0 &&
                      <Fragment>
                        {
                          this.state.properties.map((i, index) =>
                            <FadeButton key={`${i.name}_${index}_checkbox`} text={i.name}>
                              {
                                i.values.map(value =>
                                  <div key={`${i.name}_${index}_${value}_checkbox`} className="propertyCheckbox">
                                    <RedCheckbox isChecked={this.doesPropertyExist({ name: i.name, value }, this.state.addedProperties)} id={`${i.name}_${index}_${value}_checkbox`} value={{ name: i.name, value }} click={this.addProperty} />
                                    <label htmlFor={`${i.name}_${index}_${value}_checkbox`} >
                                      <span>{value}</span>
                                    </label>
                                  </div>
                                )
                              }
                            </FadeButton>
                          )
                        }
                      </Fragment>
                    }
                  </div>
                </GreyBG>
              }
              <div id="store_catalog">
                <div id="store_options">
                  <select value={this.state.listSequence} onChange={this.changeSequenceOfList}>
                    <option value={1}>{this.props.info.lang === 'ua' ? 'Популярнi' : 'Популярные'}</option>
                    <option value={2}>{this.props.info.lang === 'ua' ? 'Cпочатку дорогі' : 'Сначала дорогие'}</option>
                    <option value={3}>{this.props.info.lang === 'ua' ? 'Cпочатку дешеві' : 'Сначала дешевые'}</option>
                  </select>
                  <div id="store_size">
                    <img src={this.state.storeItemSize === 1 ? store1_a : store1} alt="store_item_size" data-size="1" onClick={this.cahngeStoreItemSize} />
                    <img src={this.state.storeItemSize === 2 ? store2_a : store2} alt="store_item_size" data-size="2" onClick={this.cahngeStoreItemSize} />
                    <img src={this.state.storeItemSize === 3 ? store3_a : store3} alt="store_item_size" data-size="3" onClick={this.cahngeStoreItemSize} />
                  </div>
                </div>
                <hr />
                <div id="store_items" style={this.state.storeItemSize === 1 || this.state.storeItemSize === 3 ? { flexDirection: 'column' } : { flexDirection: 'row', justifyContent: 'center' }}>
                  {
                    this.state.readyItems.map(i => <Item item={i} key={i._id} style={this.state.storeItemSize} name={i.name} price={i.themes[0].price} link={i._id} photo={i.themes[0].main_photo} rating={i.themes[0].rating} />)
                  }
                </div>
              </div>
              <PageChanger click={this.changePageViaPanel} currentPage={this.state.indexOfCurrentPage} amountOfIncoming={this.state.amountOfWholeCatalog} divideBy={this.state.amountOfIncoming} />
            </div>
          }
          {this.props.info.resolution >= 1024 &&
            <div id="store_shop">
              <div id="side_filter">
                <div id="sticky_wrapper">
                  {this.state.companies.length > 0 &&
                    <FadeButton text="Бренд">
                      <div id="brands">
                        {
                          this.state.companies.map(i =>
                            <div key={i._id} className="brand">
                              <RedCheckbox isChecked={this.state.pickedCompanies.includes(i._id) ? true : false} id={`brands_${i._id}`} value={i._id} click={this.pickCompany} />
                              <label htmlFor={`brands_${i._id}`}>
                                <span className="noselect store_property">{i.name}</span>
                              </label>
                            </div>
                          )
                        }
                      </div>
                    </FadeButton>
                  }
                  <FadeButton text={this.props.info.lang === 'ua' ? 'Цiна' : 'Цена'}>
                    <div id="store_prices">
                      <div id="store_price_inputs">
                        <Input value={this.state.minPrice} type="number" input={this.pickMinPrice} id="minPrice" />
                        <hr />
                        <Input value={this.state.maxPrice} type="number" input={this.pickMaxPrice} id="maxPrice" />
                        <span>грн</span>
                      </div>
                    </div>
                  </FadeButton>
                  {this.state.properties.length > 0 &&
                    <Fragment>
                      {
                        this.state.properties.map((i, index) =>
                          <FadeButton key={`${i.name}_${index}_checkbox`} text={i.name}>
                            {
                              i.values.map(value =>
                                <div key={`${i.name}_${index}_${value}_checkbox`} className="propertyCheckbox">
                                  <RedCheckbox isChecked={this.doesPropertyExist({ name: i.name, value }, this.state.addedProperties)} id={`${i.name}_${index}_${value}_checkbox`} value={{ name: i.name, value }} click={this.addProperty} />
                                  <label htmlFor={`${i.name}_${index}_${value}_checkbox`} >
                                    <span>{value}</span>
                                  </label>
                                </div>
                              )
                            }
                          </FadeButton>
                        )
                      }
                    </Fragment>
                  }
                </div>
              </div>
              <div id="store_catalog">
                <h1 id="store_title" style={{ fontFamily: this.props.css.fonts.text }}>{this.state.nameOfCategory}</h1>
                <div id="store_catalog_shop">
                  <div id="store_options">
                    <select value={this.state.listSequence} onChange={this.changeSequenceOfList}>
                      <option value={1}>{this.props.info.lang === 'ua' ? 'Популярнi' : 'Популярные'}</option>
                      <option value={2}>{this.props.info.lang === 'ua' ? 'Cпочатку дорогі' : 'Сначала дорогие'}</option>
                      <option value={3}>{this.props.info.lang === 'ua' ? 'Cпочатку дешеві' : 'Сначала дешевые'}</option>
                    </select>
                    <div id="store_size">
                      <img src={this.state.storeItemSize === 1 ? store1_a : store1} alt="store_item_size" data-size="1" onClick={this.cahngeStoreItemSize} />
                      <img src={this.state.storeItemSize === 2 ? store2_a : store2} alt="store_item_size" data-size="2" onClick={this.cahngeStoreItemSize} />
                      <img src={this.state.storeItemSize === 3 ? store3_a : store3} alt="store_item_size" data-size="3" onClick={this.cahngeStoreItemSize} />
                    </div>
                  </div>
                  <hr />
                  <div id="store_items" style={this.state.storeItemSize === 3 ? { flexDirection: 'column' } : { flexDirection: 'row' }}>
                    {
                      this.state.readyItems.map(i => <Item item={i} key={i._id} properties={i.properties} style={this.state.storeItemSize} name={i.name} price={i.themes[0].price} link={i._id} photo={i.themes[0].main_photo} rating={i.themes[0].rating} />)
                    }
                  </div>
                </div>
                <PageChanger click={this.changePageViaPanel} currentPage={this.state.indexOfCurrentPage} amountOfIncoming={this.state.amountOfWholeCatalog} divideBy={this.state.amountOfIncoming} />
              </div>
            </div>
          }
        </div>
      );
    }
    else return <NotFound errorMessage={{ ua: 'Вибачте, але ми не змогли знайти такої категорії', ru: 'Простите , но мы не смогли найти такой категории' }} />
  }
}

export default Store