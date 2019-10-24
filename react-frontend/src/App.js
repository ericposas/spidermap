import React, { Component } from 'react'
import { HashRouter as Router, BrowserRouter, Route, Switch } from 'react-router-dom'
import LoginPage from './components/Login/LoginPage'
import TestProtectedRoute from './components/Pages/TestProtectedRoute'

const App = ({ ...props }) => (
  <>
    <Router>
      <Switch>
        <Route exact path='/' component={LoginPage}/>
        <Route path='/testProtectedRoute' component={TestProtectedRoute}/>
      </Switch>
    </Router>
  </>
)

export default App
