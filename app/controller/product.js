const { Product, UserProduct } = require('../models/product');
const mongoose = require('mongoose');
const helper = require('../common/helper')
exports.createProduct = async (req, res) => {
    let { name, category, brand } = req.body;
    let newProduct = {
        name,
        category,
        brand
    }
    let productRecord = new Product(newProduct)
    try {
        let result = await productRecord.save();
        res.send(helper.respondWithResult(200, { message: "product added successfully", result }));
    } catch (err) {
        res.send(helper.handleError(err));
    }
};

exports.deleteProduct = async (req, res) => {
    let { id: productId } = req.params;
    if (mongoose.Types.ObjectId.isValid(productId)) {
        try {
            let productRecord = await Product.findById(productId).exec();
            if (productRecord) {
                let result = await Product.findOneAndRemove({ _id: productId });
                res.send(helper.respondWithResult(200, { message: "product deleted successfully", result }));
            } else {
                res.send(helper.respondWithResult(404, { message: "No product found", "result": "" }));
            }
        } catch (err) {
            res.send(helper.handleError(err));
        }
    } else {
        res.send(helper.respondWithResult(404, { message: "productID not valid", "result": "" }));
    }
}

exports.updateProduct = async (req, res) => {
    let { id: productId } = req.params;
    let { name } = req.body;
    try {
        let result = await Product.findOneAndUpdate({ _id: productId }, { name });
        res.send(helper.respondWithResult(200, { message: "product updated successfully", result }));
    } catch (err) {
        res.send(helper.handleError(err));
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        let result = await Product.find({});
        res.send(helper.respondWithResult(200, { message: "List of all products", result }));
    } catch (err) {
        res.send(helper.handleError(err));
    }
};


exports.assignProductToUser = async (req, res) => {
    try {
        let { userId, productId } = req.body
        let newProduct = {
            userId,
            productId,
        }
        let productUserRecord = new UserProduct(newProduct)

        let result = await productUserRecord.save();
        res.send(helper.respondWithResult(200, { message: "product assigned to user successfully", result }));
    } catch (err) {
        res.send(helper.handleError(err));
    }
}



exports.getUserProducts = async (req, res) => {
    try {
        let { userId , brand , category} = req.query;
        let productRecord = await UserProduct.find({ "userId": userId }).exec();
        console.log("productRecord" , productRecord);

        // filter by category and brand name
        const productIds = productRecord.map(v => v.productId)

        let result = await Product.find( { _id: { $in: productIds }, brand , category } ).exec();
        console.log("result" , result);

        res.send(helper.respondWithResult(200, { message: "get all the user products", "result" : result }));
    } catch (err) {
        res.send(helper.handleError(err));
    }
}