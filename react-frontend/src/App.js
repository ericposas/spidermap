import React, { Component } from 'react'
import { HashRouter as Router, BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import LoginPage from './components/Login/LoginPage'
import SignUp from './components/Login/SignUp'
import TestProtectedRoute from './components/Pages/TestProtectedRoute'
import GetAirports from './components/Pages/GetAirports' // requires auth
import Dashboard from './components/Pages/Dashboard'
import Spidermap from './components/Pages/Spidermap'
import Pointmap from './components/Pages/Pointmap'
// import SelectionView from './components/Views/SelectionView'

const App = ({ ...props }) => (
  <>
    <Router>
      <Switch>
        <Route exact path='/'>
          <Redirect to='/login'/>
        </Route>
        <Route path='/login' component={LoginPage}/>
        <Route path='/dashboard'>
          <Dashboard/>
        </Route>
        <Route path='/spidermap' component={Spidermap}/>
        <Route path='/pointmap' component={Pointmap}/>
        <Route path='/signUp' component={SignUp}/>
        <Route path='/testProtectedRoute' component={TestProtectedRoute}/>
        <Route path='/getAirports' component={GetAirports}/>
      </Switch>
    </Router>
  </>
)

export default App
