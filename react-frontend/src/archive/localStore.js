const checkAuth = () => {
  if (localStorage.getItem('appUser')) {
    let appUser = JSON.parse(localStorage.getItem('appUser'))
    if (appUser.data.user.role.type == 'authenticated') {      
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
    return appUser.data
  }
}

export {
  getUser,
  checkAuth
}
