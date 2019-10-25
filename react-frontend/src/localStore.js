const checkAuth = () => {
  if (localStorage.getItem(process.env.APP_NAME)) {
    let appUser = JSON.parse(localStorage.getItem(process.env.APP_NAME))
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
    let appUser = JSON.parse(localStorage.getItem(process.env.APP_NAME))
    return appUser.data
  }
}

export {
  getUser,
  checkAuth
}
