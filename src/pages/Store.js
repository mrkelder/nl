import React, { Fragment, Component } from 'react'
import RedButton from '../components/RedButton'
import GreyBG from '../components/GreyBG'
import FadeButton from '../components/FadeButton'
import RedCheckbox from '../components/RedCheckbox'
import CloseBtn from '../components/CloseBtn'
import Input from '../components/Input'
import axios from 'axios'

import { Link } from 'react-router-dom'
import '../css/store.css'

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
      amountOfIncoming: 1,
      items: [],
      properties: [],
      addedProperties: []
    }

    this.pickMaxPrice = this.pickMaxPrice.bind(this);
    this.pickMinPrice = this.pickMinPrice.bind(this);
    this.openSideFilter = this.openSideFilter.bind(this);
    this.pickCompany = this.pickCompany.bind(this);
    this.updateNameOfCategory = this.updatePage.bind(this);
    this.addProperty = this.addProperty.bind(this);
  }

  componentDidUpdate() {
    const propCategory = this.props.match.params.category;
    if (this.state.propCategory !== propCategory) {
      this.updatePage(propCategory);
    }
  }

  componentDidMount() {
    const propCategory = this.props.match.params.category;
    this.updatePage(propCategory);
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
            axios.get('http://localhost:8080/getItems', { params: { itemsCategory: propCategory, amountOfIncoming: this.state.amountOfIncoming } })
              .then(({ data }) => {
                this.setState({
                  items: data
                }, () => {
                  axios.get('http://localhost:8080/getProperties', { params: { category: propCategory } })
                    .then(({ data }) => {
                      console.log(data)
                      this.setState({ properties: data });
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
        });
      }
      else {
        this.setState({
          maxPrice: Number(value)
        });
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
        });
      }
      else {
        this.setState({
          minPrice: Number(value)
        });
      }
    }
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
                                <RedCheckbox id={`brands_${i._id}`} value={i._id} click={this.pickCompany} />
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
                                    <RedCheckbox id={`${i.name}_${index}_${value}_checkbox`} value={{ name: i.name, value }} click={this.addProperty} />
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
                              <RedCheckbox id={`brands_${i._id}`} value={i._id} click={this.pickCompany} />
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
                                  <RedCheckbox id={`${i.name}_${index}_${value}_checkbox`} value={{ name: i.name, value }} click={this.addProperty} />
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
              </div>
            </div>
          }
        </div>
      );
    }
    else {
      return <h1>404</h1>;
    }
  }
}

export default Store
