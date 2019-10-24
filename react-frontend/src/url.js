const url = (process.env.NODE_ENV == 'development' ? `http://${process.env.DEV_IP}` : `http://${process.env.PROD_IP}`)

export default url
