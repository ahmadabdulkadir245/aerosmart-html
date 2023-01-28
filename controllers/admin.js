const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    const editMode = req.query.edit
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: editMode
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const price = req.body.price
    const imageUrl = req.body.imageUrl
    const description = req.body.description
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user.id
    })
    .then(result => {
        res.redirect('/')
    })
    .catch(err => console.log(err))
}

exports.getAdminProducts =  (req, res, next) => {
    const editMode = req.query.edit
    Product.findAll()
    .then(products => {
        res.render('admin/products', {
            pageTitle: 'Add Product',
            path: '/admin/products',
            prods: products.reverse(),
            hasProducts: products.length > 0,
            editing: editMode
        })
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if(!editMode) {
      return res.redirect('/')
    }
        const productId = req.params.productId
        Product.findByPk(productId)
        .then(product => {
            if(!product) {
                return res.redirect('/')
              }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                product: product,
                editing: editMode
            })
        })
        .catch(err => console.log(err))
} 

exports.postEditProduct = (req, res, next) => {
    const updatedProductId = req.body.productId
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedImageUrl = req.body.imageUrl
    const updatedDescription = req.body.description
    updatedDescription.trim()
    updatedPrice.trim()
    updatedImageUrl.trim()
    updatedDescription.trim()

 Product.findByPk(updatedProductId)
    .then(product => {
    product.title = updatedTitle,
    product.price = updatedPrice,
    product.imageUrl = updatedImageUrl,
    product.description = updatedDescription

    return product.save()
    })
    .then(result => {
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct =  (req, res, next) => {
    const productId = req.body.productId
    Product.findByPk(productId)
    .then(product => {
        return product.destroy()
    })
    .then(result => {
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

