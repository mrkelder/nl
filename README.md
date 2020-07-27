# Online Shop "New London"

This is my second project when I'm writing online shop. First I tried to write it in a plain front-end , but
a bit later everything crashed accidentally. So now I'm rewriting the project again in order to practice React
and fix the problems I missed before. 

[Here you can access server version](https://github.com/mrkelder/nl_s)

## Preparation

For this project you'll need to:

1) Install all dependencies **npm i**
2) Run project with **npm start**

## Hierarchy

Here you can examine the hierarchy of this application

```
project
│   README.md
│   .gitignore
│   package.json
│   package-lock.json
│
└───node_modules
│
└───public - public files
│   │ favicon.ico - icon
│   │ index.html - main html file
│   │ logo192.png - icon for apple devices
│   │ manifest.json
│   │ robots.txt
│
└───src
    │ App.js - app file
    │ index.js - major js file
    │ context.js - file , that contains all contexts
    │
    └───components
    │   │ CallBack.js - call me back window
    │   │ CloseBtn.js - button with a close img
    │   │ GreyBG.js - grey background with absolute position
    │   │ Header.js - header component
    │   │ Input.js - underlined input
    │   │ RedButton.js - red button
    │   │ Slider.js - slider
    │   │ SlidingPart.js - sliding part HOC
    │   │ Item.js - item in the shop
    │   │ TopItems.js - catalog of the most popular ones
    │   
    └───css - css files compiled by sass
    │   
    └───scss
    │   │ index.scss - scss file with the fonts and e.g.
    │   │ header.scss - header's styles
    │   │ callback.scss - scss for call me back window
    │   │ _init.scss - file with colors and mixins
    │   │ _slider.scss - slider's scss file
    │   │ main.scss - scss file for the main page
    │   │ _radio.scss - styles for the radio buttons
    │
    └───fonts
    │   │ Manrope-ExtraBold.ttf - font for the headers
    │   │ Manrope-Regular.ttf - font for the text
    │
    └───img - static images
    │
    └───pages
        │ 404.js - not found page (/*)
        │ Main.js - index page (/)

```

## Context

Takes place in **src/context.js**.
Contains the next contexts

1) info - information about the client side
  a) lang - language
  b) changeLang - functiona that changes language *(does NOT get any argument)*
2) css - css properties
  a) colors
  b) fonts
3) img - images

## Mixins (HOCs)

### SlidingPart.js (class component)

Takes place in **src/SlidingPart.js**. Gives an opportunity to make a slidable element. Takes two parametars **OriginalComponent** and **addInfo**. As the props it gives **slides** from **addInfo.slides** *(it can be whatever)* , **slidingPart** extended from **this.SlidingPartRef** , **sliderPanelRef** extended from **this.SliderPanelRef** and **this.state**.

#### Imports

```
import React, { Component } from 'react'
import { info } from '../context'
```

#### Properties

1) this.SlidingPartRef - ref to the sliding part
2) this.SliderPanelRef - ref to the element that makes sliding part to move
3) this.state.currentPosition - current position of the sliding part *(this.SlidingPartRef)*
4) this.state.startPosition - starting position when you touch the screen
5) this.state.endPosition - final position for the sliding part *(this.SlidingPartRef)* , then this coordinate will be taken for the calculating to determine current starting coordinate properly
6) this.state.totalSlidingWidth - width of the sliding element *(compulsory to depend on it because an actual width of the this.SlidingPartRef is **NOT** real)*
7) this.state.currentPositionOnScreen - position from 0 to width of **this.SliderPanelRef**
8) this.state.isTouched - is sliding **this.SliderPanelRef** touched
9) this.state.isBeingTouched - is slider being touced *(used within **this.state.isTouched** in some cases)*

#### Lifecycle

Lifecycle takes place in **updateHOC** function.

In **componentDidMount** it defines the total width , sets the actions while **touchstart** (**mousedown**) , **touchend** (**mouseup**) and **touchmove** (**mousemove**). In **touchstart** (**mousedown**) listener the transition is disabled and **this.state.startPosition** gets set. **touchmove** (**mousemove**) changes **this.state.currentPosition** that moves **this.SlidingPartRef** via *transform: translate3D*. **touchend** (**mouseup**) sets transition to *'transform .2s'* and **this.state.endPosition** to the x coordinate of *translate3D*. If this value if bigger than 0 , it slides to the start. If the value is less than **-this.state.totalSlidingWidth**, it slides to the end.

## Pages

### 404.js

Takes place in **src/pages/404.js**. Serves */\** root.

### Main.js

Takes place in **src/pages/Main.js**. Serves */* root.

#### Imports

```
import React, { Fragment, useEffect, useState, useContext } from 'react'
import SlidingPartHOC from '../components/SlidingPart'
import Slider from '../components/Slider'
import TopItems from '../components/TopItems'

import { img, info, css } from '../context'
import axios from 'axios'
import '../css/main.css'
```

#### Properties

1) photosForSlider
2) red - red color
3) text - 'text' font
4) lang - current language

#### Sub components

1) ActualSlider - **Slider.js** wrapped in **SlidingPart.js**

## Components

### App.js (class component)

Takes place in **src/App.js**.

#### Imports

```
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
import radio from './img/radio.png'
import radio_checked from './img/radio_checked.png'
import star from './img/star.png'
import star_active from './img/star_active.png'
import truck from './img/truck.png'
import like from './img/like.png'
import checked from './img/checked.png'
```

#### Properties

1) this.state.lang - language [ru/ua/null]
2) this.state.hasError - error somewhere downstairs the tree
3) this.state.colors - the colors of the project
4) this.state.fonts - fonts for the project
5) this.state.images - images for the project
6) this.state.resolution - resolution of the window

#### Methods

1) this.componentDidMount - sets the default language (ua) and sets *resize event* to change current resultion
2) this.changeLang - changes language (can be ua or ru only)
3) this.componentDidCatch - handles when there is a problem downstairs the tree (you can check it out by accessing this.state.hasError)
4) this.changeResolution - changes **this.state.resolution** value on every *resize event*

### Radio.js (functional component)

Takes place in **src/components/Radio.js**.

#### Imports

```
import React, { Fragment, useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import { img } from '../context'
```

#### Properties

1) radio - current image *(checked / unchecked)*
2) inpRef - ref to the input

#### Methods

1) check - handles on click

#### Props

1) name
2) id
3) isCehcked
4) click - function fires while clicking the input
5) index - index of the clicked radio

### CallBack.js (functional component)

Takes place in **src/components/CallBack.js**.

#### Imports

```
import React, { useContext, useState } from 'react'
import axios from 'axios'
import { info, css } from '../context'
import GreyBg from './GreyBG'
import CloseBtn from './CloseBtn'
import Input from './Input'
import RedButton from './RedButton'
import '../css/callback.css'
```

#### Props

1) close - function that gives state changer
2) input - information , given to the **<Input/>** component inside of **<CallBack/>**

#### Properties

1) lang - the language
2) text_light_grey , red - colors
3) inputColor - the color of the line underlining the input
4) inputText - text of the input
5) condition - the condition that allows to send message to the server

#### Methods

1) closeWindow - closes the window by using **close** method and passing false value
2) submitInput - sends message to the server by comparing the condition and the value

### Slider.js (functional component)

Takes place in **src/components/Slider.js**. Depends on **SlidingPart.js**.

#### Imports

`
import React, { Fragment, useRef, useEffect, useState, useCallback } from 'react'
import Radio from './Radio'
import notFound from '../img/notFound.jpg'
`

#### Props

1) slides
2) currentPosition - current position of the sliding part *(this.SlidingPartRef)*
3) slidingPart - ref to the sliding part
4) sliderPanelRef - ref to the element that makes sliding part to move
5) changeCurrentPosition - function that changes **currentPosition**
6) currentPositionOnScreen - position from 0 to width of **sliderPanelRef**
7) isTouched - is slider touched
8) isBeingTouched - is slider being touced *(used within **isTouched** in some cases)*

#### Properties

1) sliderHeight - height of one slide. The height is taken to set the actual slider's height.
2) imgRef - ref to the photos to set **sliderHeight**
3) onePiece - the width of one slide
4) oneSector - 1/4 of **onePiece**
5) currentSlide - an index of the current slide
6) componentIsReady - is component ready for final slide logic
7) margin - margin from the left side
8) radios - radio buttons in slider

#### Methods

1) SliderHeight - sets **sliderHeight**
2) becomeChecked - logic for radio buttons

### CloseBtn.js (functional component)

Takes place in **src/components/CloseBtn.js**.

#### Imports

```
import React, { useContext } from 'react'
import { img } from '../context'
```

#### Props

1) theme - takes either **0** or **1** as an argument (0 - black , 1 - white)
2) click - method that fires when hitting the close button

#### Properties

1) crossWhite, cross - images

### GreyBG.js (functional component)

Takes place in **src/components/GreyBG.js**.
*Renders in a portal*

#### Imports

```
import React from 'react'
import ReactDOM from 'react-dom'
```

#### Props

1) style - additional styles for the grey background
2) click - fires when clicking grey background
3) children - all elements inside (usually windows)

#### Properties

1) crossWhite, cross - images

### Header.js (functional component)

Takes place in **src/components/Header.js**.

#### Imports

```
import React, { useContext, Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GreyBG from './GreyBG'
import CloseBtn from './CloseBtn'
import CallBack from './CallBack'
import Input from './Input'

import { info, css, img } from '../context'
import '../css/header.css'
import axios from 'axios'
```

#### Properties

1) chosenItem - chosen item in the catalog *(works only for desktop with the resolution more or equal than 1024px)*
2) isMenuOpen - determines whether a menu open or not *(works only for mobile devices)*
3) resolution - **prop** that receives the resolution of the window
4) isCatalogOpen - determines is catalog open or not
5) isLangOpen - determines whether a language panel open or not *(works only for mobile devices)*
6) isCallBackOpen - is call me back window open
7) isSearchOpen - determines is search open or not *(works only for mobile devices)*
8) isCatalogUploaded - checks is catalog uploaded from the server to suggest users to reload the catalog
9) catalogHasProblem - gives **true** in case the server didn't retrieve the catalog
10) searchText - the text in a search field
11) catalog - current catalog
12) subItems - sub items for the catalog *(e.g. phones -> smartphones , sim , etc...)*
13) subItemsName - name for the sub items *(in the example above it woulds be 'phones')*
14) subItemsLeft - determines the left position of the catalog in vw *(works only for mobile devices)*
15) lang - chosen language
16) changeLang - function that changes the language
17) links - links for the menu and first section of the pc header
18) grey_links - another pair of links *(works only for mobile devices)*

#### Methods

1) getCatalog - retrieves the catalog from the server
2) openCallBack - opens call me back window
3) openMenu - opens the menu *(works only for mobile devices)*
4) openCatalog - opens the catalog
5) changeSearchText - changes search's text
6) openSubItems - opens sub items
7) closeSubItems - closes sub items *(works only for mobile devices)*
8) chooseItem - when choosing item this function closes catalog and sub items
9) openSearch - opens the search *(works only for mobile devices)*

#### Sub Componets

1) SearchIcon - search icon *(takes one prop: click - click function)*
2) MenuIcon - menu icon *(takes one prop: img - image)*

### Item.js (functional component)

Takes place in **src/components/Item.js**.

#### Imports

```
import React, { useEffect, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import RedButton from './RedButton'
import { img, info } from '../context'
import PropTypes from 'prop-types'
```

#### Props

1) name - name of the item
2) price - price in grivnas
3) rating - nubmer from **0** to **5** 
4) link - link to an item *(only its **_id** is passed)*
5) photo - link to the photo *(only the name of the file)*

#### Properties

1) roundedPrice - a rounded price of the item *(made for sure)*
2) lang - current lang
3) { star, star_active, bin, favorite } -images
4) stars - an array that contains active stars to render them

#### Methods

1) makeUndraggble - makes the photos undraggble

### TopItems.js (functional component)

Takes place in **src/components/TopItems.js**.

#### Imports

```
import React, { useState, useEffect } from 'react'
import SlidingPart from './SlidingPart'
import Item from './Item'
import axios from 'axios'
import PropTypes from 'prop-types'
```

#### Props

All properties are taken from **SlidingPart.js**

1) slidingPart
2) sliderPanelRef 
3) currentPosition 
4) updateHOC

#### Properties

1) items - all items to render

### Input.js (functional component)

Takes place in **src/components/Input.js**.
**props.value** must be connected by parent component's state

#### Imports

```
import React, { Fragment , useContext } from 'react'
import { img } from '../context'
```

#### Props

1) type
2) text - text above the input
3) placeholder
4) color - color of the underlining line
5) input - onChange event *(receives e.target.value)*
6) value - value of the input
7) isSearch - shows search panel with clean up and submit buttons in case of **true** , otherwise the panel won't be shown *(useful in case when you want to use a pure input)*
8) submit - submit function

#### Properties

1) search , crossRed - images

#### Methods

1) cleanSearch - cleans the search up by giving **input** an argument of the empty string 

#### Sub Componets

1) SearchIcon - search icon *(takes one prop: click - click function)*
2) MenuIcon - menu icon *(takes one prop: img - image)*

### RedButton.js (functional component)

Takes place in **src/components/RedButton.js**.

#### Imports

```
import React from 'react'
```

#### Props

1) text - text of the button
2) click - onClick function
