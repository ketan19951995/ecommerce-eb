const { Product, UserProduct } = require('../models/product');
const mongoose = require('mongoose');
const helper = require('../common/helper')
const jwt = require('jsonwebtoken');
exports.createProduct = async (req, res) => {
    let { name, category, brand } = req.body;
    let newProduct = {
        name,
        category,
        brand
    }
    if (!name || !category || !brand) {
        res.send(helper.respondWithResult(422, { message: "Missing name  , category or brand", result: {} }));
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
    let { name, category, brand } = req.body;
    try {
        if (mongoose.Types.ObjectId.isValid(productId)) {
            let productRecord = await Product.findById(productId).exec();
            if (productRecord) {
                let result = await Product.findOneAndUpdate({ _id: productId }, { name, brand, category });
                res.send(helper.respondWithResult(200, { message: "product updated successfully", result }));
            }
        } else {
            res.send(helper.respondWithResult(404, { message: `No product found with the given Id ${productId}`, "result": "" }));
        }
    } catch (err) {
        res.send(helper.handleError(err));
    }
}


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
        if (!userId || !productId) {
            res.send(helper.respondWithResult(422, { message: "Missing  userId or productId", result: {} }));
        }
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
        let { brand, category } = req.query;
        let { authorization: token } = req.headers

        // get userId from token
        let decoded = jwt.verify(token, process.env.SECRETKEY);
        let { ID: userId } = decoded;

        if (!brand || !category) {
            res.send(helper.respondWithResult(422, { message: "Missing  userId or brand or category", result: {} }));
        }
        let productRecord = await UserProduct.find({ "userId": userId }).exec();

        // filter by category and brand name
        const productIds = productRecord.map(v => v.productId)
        let result = await Product.find({ _id: { $in: productIds }, brand, category }).exec();
        res.send(helper.respondWithResult(200, { message: "Filtered prodcuts by brand and category", "result": result }));
    } catch (err) {
        res.send(helper.handleError(err));
    }
}