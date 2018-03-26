/* eslint no-unused-expressions: 0 */

import 'babel-polyfill'
import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { injectGlobal } from 'styled-components'

import 'normalize.css'

import Breeds from './pages/Breeds'
import SubBreeds from './pages/SubBreeds'

import store from './store'

const target = document.getElementById('root')

injectGlobal`
  html {
    padding: 2rem 4rem;

    background-color: #fafafa;
    font-family: "Roboto", sans-serif;
  }
`

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path='/' component={Breeds} />
        <Route path='/:breed' component={SubBreeds} />
      </Switch>
    </Router>
  </Provider>,
  target
)
