const url = (process.env.MODE == 'development' ? `http://${process.env.DEV_IP}` : `http://${process.env.PROD_IP}`)
// const url = `http://${process.env.DEV_IP}:${process.env.PORT}`

export default url
