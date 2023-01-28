const express = require('express')

const path = require('path')
const bodyParser = require('body-parser')

// database or sequelize database import
const sequelize = require('./util/database')

// database models import
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

// error page controller
const errorController = require('./controllers/error')

const app = express()

// defining my templating engine
app.set('view engine', 'ejs')
app.set('views', 'views')


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user
        next()
    })
    .catch(err => console.log(err))
})

const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')

app.use(shopRoutes)
app.use('/admin', adminRoutes)

app.use(errorController.getErrorPage)

// Defining Relations
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, {through: CartItem})
Product.belongsToMany(Cart, {through: CartItem})
User.hasMany(Order)
Order.belongsToMany(Product, {through: OrderItem})
sequelize.sync(
    // {force: true}
)
.then(result =>{
    return User.findByPk(1)
})
.then(user => {
    if(!user) {
        User.create({name: 'Ahmad Abdulkadir', email: 'ahmadabdulkadir245@gmail.com'})
    }
    return user
})
.then(user => {
    return user.createCart()
})
.then(cart => {
    app.listen(3001)
})
.catch(err => console.log(err))


