import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import lastLocation from './reducers/lastLocation'
import selectedOriginSpidermap from './reducers/selectedOriginSpidermap'
import selectedOriginsPointmap from './reducers/selectedOriginsPointmap'
import selectedDestinationsPointmap from './reducers/selectedDestinationsPointmap'
import selectedDestinationsSpidermap from './reducers/selectedDestinationsSpidermap'
import selectedDestinationsListView from './reducers/selectedDestinationsListView'
import App from './App'
import './globalStyles.scss'

window.beforeunload = () => { sessionStorage.removeItem(process.env.APP_NAME) }
window.unload = () => { sessionStorage.removeItem(process.env.APP_NAME) }

const root = document.getElementById('root')
const rootReducer = combineReducers({
  lastLocation, selectedOriginSpidermap, selectedOriginsPointmap,
  selectedDestinationsPointmap, selectedDestinationsSpidermap,
  selectedDestinationsListView
})
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
