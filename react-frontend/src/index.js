import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import App from './App'
import gameListVisibility from './reducers/gameListVisibility'

const root = document.getElementById('root')
const rootReducer = combineReducers({
  gameListVisibility
})
const store = createStore(rootReducer)
store.subscribe(() => console.log(store.getState()))

ReactDOM.render(
  <Provider store={store}>
    <App content="this is where we would check user credentials to protect the application routes" />
  </Provider>,
  root
)
