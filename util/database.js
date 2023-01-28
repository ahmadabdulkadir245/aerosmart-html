const Sequelize = require('sequelize')

const sequelize = new Sequelize('aerosmart-db', 'root', 'Ahano1one$', {dialect: 'mysql', host: 'localhost'})

module.exports = sequelize