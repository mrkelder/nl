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
    │   
    └───css
    │   │ index.css - css file with the fonts
    │   │ header.css - header's styles
    │   │ callback.css - css for call me back window
    │   │ _init_.css - file with colors and mixins
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

## Components

### App.js (class component)

Takes place in **src/App.js**.

#### Imports

```
import React, { Fragment, useState, useEffect } from 'react' // React utilities
import { Switch, Route, Link } from 'react-router-dom' // React-router lib
import Header from './components/Header' // Header component
import Main from './pages/Main' // Main page
import NotFound from './pages/404' // 404 page
import { info as Info, colors as Colors } from './context' // Contexts
import './css/index.css' // importing fonts

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
```

#### Properties

1) this.state.lang - language [ru/ua/null]
2) this.state.hasError - error somewhere downstairs the tree
3) this.state.colors - the colors of the project
4) this.state.fonts - fonts for the project
5) this.state.images - images for the project

#### Methods

1) this.componentDidMount - sets the default language (ua)
2) this.changeLang - changes language (can be ua or ru only)
3) this.componentDidCatch - handles when there is a problem downstairs the tree (you can check it out by accessing this.state.hasError)

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
2) input - input in the window

#### Properties

1) lang - the language
2) text_light_grey , red - colors
3) inputColor - the color of the line underlining the input
4) inputText - text of the input
5) condition - the condition that allows to send message to the server

#### Methods

1) closeWindow - closes the window by using **close** method and passing false value
2) submitInput - sends message to the server by comparing the condition and the value

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
3) resolution - the resolution of a device
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

#### Sub Componenets

1) SearchIcon - search icon *(takes one prop: click - click function)*
2) MenuIcon - menu icon *(takes one prop: img - image)*

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

1) search , cross_red - images

#### Methods

1) cleanSearch - cleans the search up by giving **input** an argument of the empty string 

#### Sub Componenets

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
