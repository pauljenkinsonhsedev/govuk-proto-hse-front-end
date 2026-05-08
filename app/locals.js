module.exports = function (config) {
  config.addGlobal('isProduction', process.env.NODE_ENV === 'production')
}