import React, { Component, Fragment } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import SpecificGame from './SpecificGame'
import { connect } from 'react-redux'
import { VISIBLE, HIDDEN } from '../constants/constants'
import axios from 'axios'

class Games extends Component {
  constructor (props) {
    super(props)
    this.state = {
      games: null
    }
  }
  componentDidMount () {
    this.unlisten = this.props.history.listen((location, action) => this.getData())
    this.getData()
  }
  getData = async () => {
    const { dispatch } = this.props
    let url
    if (process.env.MODE == 'development') url = `http://${process.env.DEV_IP}:${process.env.PORT}/games`
    else url = `http://${process.env.PROD_IP}/games`
    console.log(url)
    try {
      let data = await axios.get(url)
      let gamesList = data.data.map(game => (
        <Fragment key={game.title}>
          <div>{game.title}</div>
        </Fragment>
      ))
      this.setState({
        games: gamesList
      })
    } catch (e) {
      console.log(e)
    }
  }
  render () {
    const { gameListVisibility } = this.props
    return (
      <>
        <div>Games Route</div>
        { gameListVisibility == VISIBLE ? <><br></br><div>content:</div></> : '' }
        {
          this.state.games == null
          ? <div>loading titles...</div>
          : (gameListVisibility == VISIBLE
             ? <div>{this.state.games}</div>
             : '')
        }
        <br/>
        <Router>
          <Switch>
            <Route path='/games/:id' component={SpecificGame}/>
          </Switch>
        </Router>
      </>
    )
  }
}

export default connect(state => ({ ...state }))(Games)
