const gameListVisibility = (state = 'VISIBLE', action) => {
  switch (action.type) {
    case 'GAME_LIST_VISIBILITY':
      return action.payload
      break;
    default:
      return state
  }
}

export default gameListVisibility
