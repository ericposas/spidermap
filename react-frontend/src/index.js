import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import lastLocation from './reducers/lastLocation'
import selectedLocations from './reducers/selectedLocations'
import App from './App'
import './globalStyles.scss'

window.beforeunload = () => { sessionStorage.removeItem(process.env.APP_NAME) }
window.unload = () => { sessionStorage.removeItem(process.env.APP_NAME) }

const root = document.getElementById('root')
const rootReducer = combineReducers({ lastLocation, selectedLocations })
const store = createStore(rootReducer)

store.subscribe(() => {
  console.log(store.getState())
})

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  root
)
