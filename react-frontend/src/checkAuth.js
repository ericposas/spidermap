import axios from 'axios'
import url from './url'

const checkAuth = async () => {
  try {
    // retrieve jwt from the session
    let session = await axios.get(`${url}/getSession`)
    if (session) {
      return session
    }
  } catch (e) {
    console.log(e)
  }
}

export default checkAuth
