import React, { Component } from 'react'
import { HashRouter as Router, BrowserRouter, Route, Switch } from 'react-router-dom'
import LoginPage from './components/Login/LoginPage'
import TestProtectedRoute from './components/Pages/TestProtectedRoute'
import GetAirports from './components/Pages/GetAirports' // requires auth

const App = ({ ...props }) => (
  <>
    <Router>
      <Switch>
        <Route exact path='/' component={LoginPage}/>
        <Route path='/testProtectedRoute' component={TestProtectedRoute}/>
        <Route path='/getAirports' component={GetAirports}/>
      </Switch>
    </Router>
  </>
)

export default App
