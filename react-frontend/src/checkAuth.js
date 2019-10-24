const checkAuth = () => {
  if (localStorage.getItem('appUser')) {
    let appUser = JSON.parse(localStorage.getItem('appUser'))
    if (appUser && appUser.user.confirmed == true &&
        appUser.user.role.type == 'authenticated') {
      console.log(appUser.user)
      console.log('user is authenticated, you are free to continue.')
      return true
    } else {
      return false
    }
    return false
  }
}

const getUser = () => {
  if (localStorage.getItem('appUser')) {
    let appUser = JSON.parse(localStorage.getItem('appUser'))
    return appUser
  }
}

export {
  getUser,
  checkAuth
}
