const url = (process.env.MODE == 'development' ? `http://${process.env.DEV_IP}:${process.env.PORT}` : `http://${process.env.PROD_IP}`)

export default url
