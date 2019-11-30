import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers/rootReducer'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globalStyles.scss'
import './images/GettyImages-157529424.png'

window.beforeunload = () => { sessionStorage.removeItem(process.env.APP_NAME) }
window.unload = () => { sessionStorage.removeItem(process.env.APP_NAME) }

// uncomment below to enable auto-logout function 
// let logoutTimer, timeLength = (60 * 1000 * 15)
// const setLogoutTimer = () => {  // auto logout timer -- 15 minutes
//   if (logoutTimer) clearTimeout(logoutTimer)
//   if (sessionStorage.getItem(process.env.APP_NAME)) {
//     logoutTimer = setTimeout(() => {
//       sessionStorage.removeItem(process.env.APP_NAME)
//       window.location.reload()
//     }, timeLength)
//     console.log('timer reset to auto-logout in 15 minutes')
//   } else {
//     console.log('not logged in')
//   }
// }
// setLogoutTimer()
// window.onmousemove = () => setLogoutTimer()

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
