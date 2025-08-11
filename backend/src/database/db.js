const { connect } = require('mongoose')
const config = require('../_config/config')
const {
  RestartCustomValuesCronJobs,
} = require('../AgencyAppRoutes/custom_value/services')

const connectDb = () => {
  const mongooseOptions = {
    useNewUrlParser: true,
    // useCreateIndex     : true,
    // useFindAndModify   : false,
    useUnifiedTopology: true,
  }

  connect(config.mongodb_uri, mongooseOptions)
    .then(() => {
      console.log('Database connected')
      RestartCustomValuesCronJobs()
    })
    .catch((err) => {
      console.log('Error connecting database \n', err)
    })
}

module.exports = connectDb
