import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers/rootReducer'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globalStyles.scss'
import './images/AA-background-wide.jpg'
// fonts
import './fonts/AmericanSans-Bold Italic.ttf'
import './fonts/AmericanSans-Bold.ttf'
import './fonts/AmericanSans-Book.ttf'
import './fonts/AmericanSans-BookItalic.ttf'
import './fonts/AmericanSans-Light Italic.ttf'
import './fonts/AmericanSans-Light.ttf'
import './fonts/AmericanSans-Medium Italic.ttf'
import './fonts/AmericanSans-Medium.ttf'
import './fonts/AmericanSans-Regular.ttf'
import './fonts/AmericanSans-RegularItalic.ttf'

window.beforeunload = () => { sessionStorage.removeItem(process.env.APP_NAME) }
window.unload = () => { sessionStorage.removeItem(process.env.APP_NAME) }

const root = document.getElementById('root')
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
