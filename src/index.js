import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'
import './css/index.css'
import dotenv from 'dotenv'

dotenv.config(); // Configures .env files

ReactDOM.render(
  <Router><App /></Router>,
  document.getElementById('root')
);
