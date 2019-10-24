const checkAuth = () => {
  if (localStorage.getItem('appUser')) {
    let appUser = JSON.parse(localStorage.getItem('appUser'))
    if (appUser &&
        appUser.user.id &&
        appUser.user.email &&
        appUser.user.username &&
        appUser.user.confirmed == true &&
        appUser.user.blocked == false &&
        appUser.user.role.id &&
        appUser.user.role.type == 'authenticated' &&
        appUser.user.role.name == 'Authenticated') {
      console.log('user is authenticated, you are free to continue.')
      return true
    } else {
      return false
    }
    return false
  }
}

const getUser = () => {
  if (checkAuth()) {
    let appUser = JSON.parse(localStorage.getItem('appUser'))
    return appUser
  }
}

export {
  getUser,
  checkAuth
}
