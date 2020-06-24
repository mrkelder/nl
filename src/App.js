import React, {  useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import Header from './components/Header'
import Main from './pages/Main'
import NotFound from './pages/404'
import { info as Info, css as CSS } from './context'
import './css/index.css'

function App() {
  const [lang, setLang] = useState(null);
  const colors = {
    white: '#FFF',
    red: '#e60000',
    grey: '#4a4d4e',
    light_grey: '#f4f4f4',
    text_grey: '#333',
    text_light_grey: '#999',
    window_bg: '#0a0a0aa1'
  };
  const fonts = {
    text: 'text , Arial, Helvetica, sans-serif',
    header: 'header , Arial, Helvetica, sans-serif'
  };

  useEffect(() => {
    // Sets the language
    if (localStorage.getItem('lang') === null) {
      localStorage.setItem('lang', 'ua');
    }
    setLang(localStorage.getItem('lang'));
  } , []);

  return (
    <div className="App">
      <Info.Provider value={{
        lang
      }}>
        <CSS.Provider value={{
          colors,
          fonts
        }}>
          <Header />
          <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/*" exact component={NotFound} />
          </Switch>
        </CSS.Provider>
      </Info.Provider>
    </div>
  );
}

export default App;
