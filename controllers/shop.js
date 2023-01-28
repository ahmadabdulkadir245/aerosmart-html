const Product = require('../models/product')

// product section

exports.getIndex = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render('shop/index', {
            pageTitle: 'Home',
            path: '/',
            prods: products.reverse(),
            hasProducts: products.length > 0,
        })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render('shop/product-list', {
            pageTitle: 'Product Page',
            path: '/products',
            prods: products,
            hasProducts: products.length > 0,
        })
    })
    .catch(err => console.log(err))
}

exports.getSingleProduct = (req, res, next) => {
    const productId = req.params.productId
    Product.findByPk(productId)
    .then(product => {
        res.render('shop/product-details', {
            pageTitle: 'Product Page',
            path: '/products',
            product: product,
        })
    })
    .catch(err => console.log(err))
}

// cart section

exports.getCart = (req,res, next) => {
    req.user.getCart()
    .then(cart => {
      return cart.getProducts()
      .then(products => {
          res.render('shop/cart',{
          pageTitle: 'Your Cart',
          path: '/cart',
          products: products  
          })
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
  }

  exports.postCart = (req, res, next) => {
  }

  exports.postCart = (req,res, next) => {
    const productId = req.body.productId
    // the cartConst is used to save the so that it can be used at the end of the func
    let cartConst
    // the newCartQuantity is set to 1 if the products doesn't exist
    let newCartQuantity = 1
    req.user.getCart()
    .then(cart => {
        cartConst = cart
        // this func is used to get the product with the id and is a func we defined above i.e getProducts
        return cart.getProducts({where: {id: productId}})
    })
    .then(products => {
        let product
        // this is a func to see if the prodcut with the id exist, and if it doest it is set to the variable product above
        if(products.length > 0) {
            product = products[0]
        }
        // this funcs is used to increase the newCartQauntity if the product already exist in the cart by adding one to the old cart count
        if(product) {
            const oldCartQuantity = product.cartItem.quantity
            newCartQuantity = oldCartQuantity + 1
            // this returns the product with the updated cart quantity
            return product
        }
        // this returns a func that will search for the new product which doesn't exist in the cart
        return Product.findByPk(productId)
    })
    .then(cartProduct => {
        
        return cartConst.addProduct(cartProduct, {through: {quantity: newCartQuantity}})
    })
    .then(() => {
        res.redirect('/cart')
    })
    .catch(err => console.log(err))
  }

  exports.postDeleteCart = (req, res, next) => {
    const productId = req.body.productId
    req.user.getCart()
    .then(cart => {
        return cart.getProducts({where: {id: productId}})
    })
    .then(products => {
        let product
        if(products.length > 0) {
            product = products[0]
            return product.cartItem.destroy()
        }
    })
    .then(result => {
        res.redirect('/cart')
    })
    .catch(err => console.log(err))
  }


 // order section

 exports.getOrders = (req, res, next) => {
    req.user.getOrders({includes: ['products']})
    .then(orders => {
        res.render('shop/orders',{
            pageTitle: 'Your Orders',
            path: '/order',
            orders: orders 
        })
    })
    .catch(err => console.log(err))
 }

 exports.postOrder = (req, res, next) => {
    let fetchedCart
    req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(products => {
      return req.user.createOrder()
      .then(order => {
        return order.addProducts(products.map(product => {
          product.orderItem = {quantity: product.cartItem.quantity}
          return product
        }))
      })
      .catch(err => console.log(err))
    })
    .then(result => {
      return fetchedCart.setProducts(null)
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
  }