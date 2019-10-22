import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GAME_LIST_VISIBILITY } from '../actions/actions'
import { VISIBLE, HIDDEN } from '../constants/constants'
import axios from 'axios'

class SpecificGame extends Component {
  constructor (props) {
    super(props)
    this.state = {
      game: null
    }
  }
  componentWillUnmount () {
    const { dispatch } = this.props
    this.unlisten()
    dispatch({ type: GAME_LIST_VISIBILITY, payload: VISIBLE })
  }
  componentDidMount () {
    this.unlisten = this.props.history.listen((location, action) => this.getGame())
    this.getGame()
  }
  getGame = async () => {
    const { dispatch } = this.props
    let id = this.props.match.params.id
    let url = `http://127.0.0.1/games/${id}`
    try {
      let data = await axios.get(url)
      this.setState({
        game: data.data.title
      })
      dispatch({ type: GAME_LIST_VISIBILITY, payload: HIDDEN })
    } catch (e) {
      console.log(e)
    }
  }
  render () {
    return (
      <>
        <div>specific game route:</div>
        {
          this.state.game == null
          ? <div>loading single item...</div>
          : <div>{this.state.game}</div>
        }
      </>
    )
  }
}

export default connect(state => ({ ...state }))(SpecificGame)
